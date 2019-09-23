import json
import sqlite3

from bottle import route, run, template

ENTRY_POINT = '/api'

@route(ENTRY_POINT + '/movies')
def index():
    return 'Heayy OOO, we got some movies over here'

run(host='localhost', port=8080)