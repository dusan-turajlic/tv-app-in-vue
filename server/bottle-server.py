import json
import sqlite3
import urllib.parse
from sqlite3 import Error

import requests
from bottle import get, post, run, response, request
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

def get_category_for_media( mediaId ):
    catagorie_to_media_map = connect_to_database_and_execute( 'select * from mediaToCategoryMap where mediaId = ' + str( mediaId ) )
    print( catagorie_to_media_map )


@get(API_ENTRY_POINT + '/movies')
def movies():
    response.content_type = 'application/json'
    movies = connect_to_database_and_execute('select * from mediaData where type = "movie"')

    get_category_for_media( movies[0]['id'] )

    return json.dumps(movies)


@get(API_ENTRY_POINT + '/series')
def series():
    response.content_type = 'application/json'
    series = connect_to_database_and_execute('select * from mediaData where type = "tv-series"')

    return json.dumps(series)


@post(API_ENTRY_POINT + '/trailer')
def trailer():
    response.content_type = 'application/json'
    request_body = urllib.parse.unquote(request.body.getvalue().decode('utf-8'))

    # @TODO: Figure out a better way to parse params from request body.
    url = request_body.replace( 'trailerUrl=', '' )

    trailer_html_page = requests.get(url)
    trailer_soup = BeautifulSoup(trailer_html_page.text, 'html.parser')
    trailer_json = trailer_soup.find('script', { 'class', 'imdb-player-data' }).getText().strip()

    return json.dumps(json.loads(trailer_json)[ 'videoPlayerObject' ][ 'video' ][ 'videoInfoList' ])



run(host='localhost', port=8080)