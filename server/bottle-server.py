import json
import sqlite3
from sqlite3 import Error

import requests
import urllib.parse
from bottle import post, get, run, response, request
from bs4 import BeautifulSoup

API_ENTRY_POINT = '/api'

def connect_to_database_and_execute(databaseCommand):
    def dict_factory(cursor, row):
        d = { }
        for idx, col in enumerate(cursor.description):
            d[ col[ 0 ] ] = row[ idx ]
        return d

    connection = None
    value = None
    try:
        connection = sqlite3.connect('database/mediaDatabase.db')
        connection.row_factory = dict_factory
        cursor = connection.cursor()

        cursor.execute(databaseCommand)
        value = cursor.fetchall()
    except Error as e:
        print(e)
    finally:
        if connection:
            connection.close()

    return value

MOVIE_LIST = connect_to_database_and_execute('select * from mediaData where type = "movie"')
SERIES_LIST = connect_to_database_and_execute('select * from mediaData where type = "tv-series"')
CATEGORY_LIST = connect_to_database_and_execute( 'select * from categories' )

def get_category_for_media( mediaId ):
    catagorie_to_media_map = connect_to_database_and_execute( 'select * from mediaToCategoryMap where mediaId = ' + str( mediaId ) )
    category = CATEGORY_LIST

    mediaCatagories = []
    for cat in category:
        for cmap in catagorie_to_media_map:
            if cmap['categoryId'] == cat['categoryId']:
                mediaCatagories.append(cat['name'])

    return mediaCatagories

# @TODO implament proper pagination
def paginate_media_list(media_list, size):
    return [media_list[i:i + size] for i in range(0, len(media_list), size)]


def create_response_json( media_type, media_title, media_list, page_size, index ):
    response_dict = {}
    media_dict = media_list
    for media in media_dict:
        genre = get_category_for_media( media['id'] )
        media['genre'] = genre

    paginated_list = paginate_media_list( media_dict, page_size )


    response_dict['type'] = media_type
    response_dict['title'] = media_title
    response_dict['mediaData'] = paginated_list[index]
    next_page = ''
    if index < len( paginated_list ) -1:
        next_page = request.path + '?pageSize=' + str(page_size) + '&index=' + str(index + 1)
    response_dict['nextPage'] = next_page

    return json.dumps( response_dict )


@get(API_ENTRY_POINT + '/movies')
def movies():
    query = request.query.decode()
    page_size = int(query.get('pageSize', 15))
    index = int( query.get('index', 0) )
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.content_type = 'application/json'

    return create_response_json( 'movies', 'Movies', MOVIE_LIST, page_size, index )


@get(API_ENTRY_POINT + '/series')
def series():
    query = request.query.decode()
    page_size = int(query.get('pageSize', 15))
    index = int(query.get('index', 0))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.content_type = 'application/json'

    return create_response_json( 'tv-series', 'Series', SERIES_LIST, page_size, index )


@get(API_ENTRY_POINT + '/<media>/trailer/<id>')
def trailer( media, id ):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.content_type = 'application/json'
    mediaData = []
    if media == 'movie':
        mediaData = MOVIE_LIST
    elif media == 'tv-series':
        mediaData = SERIES_LIST

    selectedMedia = list( filter( lambda m: m.get( 'id' ) == int( id ), mediaData ) )[0]

    trailer_html_page = requests.get( selectedMedia.get( 'trailer' ) )
    trailer_soup = BeautifulSoup(trailer_html_page.text, 'html.parser')
    trailer_script = trailer_soup.find('script', { 'class', 'imdb-player-data' })

    if trailer_script:
        trailer_json = trailer_script.getText().strip()
        return json.dumps({ 'trailer': json.loads(trailer_json).get( 'videoPlayerObject', {} ).get( 'video', {} ).get( 'videoInfoList', '' ) })


@post(API_ENTRY_POINT + '/slate')
def get_slate():
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.content_type = 'application/json'
    request_body = json.loads( urllib.parse.unquote(request.body.getvalue().decode('utf-8')) )

    # @TODO: Figure out a better way to parse params from request body.
    url = request_body.get( 'trailerUrl', '' )

    trailer_html_page = requests.get(url)
    trailer_soup = BeautifulSoup(trailer_html_page.text, 'html.parser')
    trailer_script = trailer_soup.find('script', { 'class', 'imdb-player-data' })
    if trailer_script:
        trailer_json = trailer_script.getText().strip()
        return json.dumps({ 'slateUrl': json.loads(trailer_json).get( 'videoPlayerObject', {} ).get( 'video', {} ).get( 'slate', '' ) })
    else:
        return json.dumps({ 'slateUrl': '' })


run(host='0.0.0.0', port=8080)