from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS

from service import DbService
from spreadsheet import getrowspreadsheet, setrowspreadsheet

import serial
import threading
import re

import pygal
import json
from datetime import datetime

windowsdb = r'C:\Users\Lucas\garden.db'
defaultLoc = "/home/pi/arduino/"
arduinohex = defaultLoc + "sensorBoard.ino.arduino.avr.uno.hex"
database = defaultLoc + "garden.db"
port = 8080
app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
connected = False
print(database)
CORS(app)
soilHumidityArr = ["0", "0", "0", "0"]
relHumidity = "0"
relTemp = "0"
lightval = "0"

@app.route('/light')
def light():
    return lightval
@app.route('/light/latest')
def latestlight():
    minutes = request.args.get('minutes', None)
    return DbService(database).selectlatestlight(minutes)


@app.route('/dht')
def dht():
    dhttuple=(relTemp, relHumidity)
    return jsonify(dhttuple)


@app.route('/dht/after/<timestamp>')
def dhtafter(timestamp):
    return DbService(database).selectdhtafter(timestamp)


@app.route('/dht/latest')
def latestdht():
    minutes = request.args.get('minutes', None)
    return DbService(database).selectlatestdht(minutes)


@app.route('/pots')
def pots():
    return DbService(database).selectpots()


@app.route('/pots/<potId>')
def potsbyid(potId):
    return soilHumidityArr[int(potId)]


@app.route('/pots/latest')
def latestpots():
    potId = request.args.get('potid', None)
    minutes = request.args.get('minutes', None)
    return DbService(database).selectlatestpotsbypotid(potId, minutes)

@app.route('/pots/period/<before>')
def potsbefore(before):
    now = datetime.now()
    timestamp = datetime.timestamp(now)
    return DbService(database).selectperiodpots(before, timestamp, 0)


@app.route('/pots/graph')
def latestpotsgraphs():
    now = datetime.now()
    timestamp = datetime.timestamp(now)
    return getgraph(0, timestamp)


@app.route('/spreadsheet')
def spreadsheet():
    print("all")
    return jsonify(getrowspreadsheet(1, 'Blad1!A3:V107'))

@app.route('/spreadsheet/range')
def spreadsheetrows():
    rowfirst = request.args.get('rowfirst', None)
    rowlast = request.args.get('rowlast', None)
    range = 'Blad1!A'
    rangetext = ':V'
    return jsonify(getrowspreadsheet(1, range+rowfirst+rangetext+rowlast))



@app.route('/spreadsheet/update', methods=['POST'])
def spreadsheetrowsset():
    print(request.json)
    values = setrowspreadsheet(request.json)

    response = app.response_class(
        response=json.dumps(values),
        status=200,
        mimetype='application/json'
    )
    return response


def getgraph(before, after):
    graph = pygal.DateTimeLine(x_label_rotation=35, truncate_label=-1,
                               x_value_formatter=lambda dt: dt.strftime('%d, %b %Y at %I:%M:%S %p'))

    data = []

    pots0 = DbService(database).selecthumbypotid(0)
    for pot in json.loads(pots0):
        data.append((datetime.strptime(pot['timestamp'], "%Y-%m-%d %H:%M:%S"), int(pot['soilTemp'])))
    # pots1 = DbService(database).selectperiodpots(before, after, 1)
    # pots2 = DbService(database).selectperiodpots(before, after, 2)
    # pots3 = DbService(database).selectperiodpots(before, after, 3)
    graph.add("pot0", data)
    graph.render_to_file('/var/www/html/chart.svg')
    return pots0

def toarray(data):
    array = []
    for da in data:
        array.__add__(da)

def read_from_port(ser, connected):
    while not connected:
        connected = True
        while True:
            if (ser.in_waiting > 0):
                line = ser.readline().decode()
                data = re.split(":", line)
                print(data)
                if data[0] == "soilHum":
                    sensor = int(data[1])
                    soilHumidity = data[2]
                    global soilHumidityArr
                    soilHumidityArr[sensor] = soilHumidity
                    pot = (soilHumidity, sensor)
                    DbService(database).insertpot(pot)

                if data[0] == "DHT":
                    global relTemp
                    relTemp= data[1]
                    global relHumidity
                    relHumidity= data[2]
                    dht = (relTemp, relHumidity)
                    DbService(database).insertdht(dht)
                if data[0] == "light":
                    global lightval
                    lightval= data[1]
                    DbService(database).insertlight(lightval)


if __name__ == '__main__':
    connected = False
    ser = serial.Serial('/dev/ttyACM0', 115200)
    thread = threading.Thread(target=read_from_port, args=(ser, connected))
    thread.start()
    app.run(debug=True, host='0.0.0.0', port=port)
