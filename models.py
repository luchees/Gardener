import sqlite3
import time
import json
TABLENAMEPOTS = "pots"
TABLENAMEDHT = "dht"
TABLELIGHT = "light"
d = "'2001-01-01 02:00:00'"
class DbModel:

    def __init__(self,db):
        self.conn = sqlite3.connect(db)

    def tojson(self, query):
        cur = self.conn.cursor()
        cur.execute(query)
        row_headers = [x[0] for x in cur.description]  # this will extract row headers
        rv = cur.fetchall()
        json_data = []

        for result in rv:
            result
            json_data.append(dict(zip(row_headers, result)))
        return json.dumps(json_data, indent=2)

    def insertpot(self, soilTemp, potId):
        query = "insert into %s " \
                "(soilTemp,potId,timestamp) " \
                "values (%s,%s,datetime('now'))" % (TABLENAMEPOTS, soilTemp, potId)

        result = self.conn.execute(query)
        self.conn.commit()
        return result
    def selectpots(self):
        query = "select  potId, soilTemp, datetime(timestamp) as timestamp  from %s" % (TABLENAMEPOTS)
        return self.tojson(query)
    def selectpot(self,potId):
        query = "select soilTemp,potId, datetime(timestamp) as timestamp from %s where potId=%s" % (TABLENAMEPOTS, potId)
        return self.tojson(query)

    def selecthumbypotid(self, potId):
        query = "select timestamp , soilTemp from %s where potId=%s" % (
        TABLENAMEPOTS, potId)
        cur = self.conn.cursor()
        cur.execute(query)
        return self.tojson(query)

    def selectlastpots(self, potId, minutes):
        query = "SELECT soilTemp, datetime(timestamp) as timestamp " \
                "FROM %s " \
                "WHERE potId=%s AND " \
                "timestamp BETWEEN datetime('now','-%s minutes') AND datetime('now') "\
                % (TABLENAMEPOTS, potId, minutes)
        return self.tojson(query)
    def selectperiodpots(self,timestampbefore,timestamp,potId):
        query = "SELECT datetime(timestamp) as timestamp, soilTemp " \
                "FROM %s " \
                "WHERE potId=%s AND timestamp BETWEEN %s AND %s" % (TABLENAMEPOTS, potId, timestampbefore, timestamp)
        return self.tojson(query)

    def insertlight(self, light):
        query = "insert into %s " \
                "(light,timestamp) " \
                "values (%s,datetime('now'))" % (TABLELIGHT, light)

        result = self.conn.execute(query)
        self.conn.commit()
        return result
    def selectlight(self):
        query = "select timestamp, light from %s" % (TABLELIGHT)
        return self.tojson(query)

    def selectlatestlight(self, limit):
        query = "select timestamp, light from %s "\
                "WHERE timestamp BETWEEN datetime('now','-%s minutes') AND datetime('now') " \
                % (TABLELIGHT, limit)
        return self.tojson(query)

    def insertdht(self, temp, hum):
        query = "insert into %s " \
                "(temp,humidity,timestamp) " \
                "values (%s,%s,datetime('now'))" % (TABLENAMEDHT, temp, hum)

        result = self.conn.execute(query)
        self.conn.commit()
        return result
    def selectdht(self):
        query = "select temp, humidity,  datetime(timestamp) as timestamp from %s" % (TABLENAMEDHT)
        return self.tojson(query)
    def selectlastdhts(self,limit):
        query = "SELECT temp, humidity,  datetime(timestamp) as timestamp " \
                "FROM %s " \
                "WHERE timestamp BETWEEN datetime('now','-%s minutes') AND datetime('now') " \
                % (TABLENAMEDHT, limit)
        return self.tojson(query)
    def selectperioddht(self,timestampbefore,timestamp):
        query = "SELECT temp, humidity,  datetime(timestamp) as timestamp " \
                "FROM %s " \
                "WHERE timestamp BETWEEN %s AND %s" % (TABLENAMEDHT, timestampbefore, timestamp)
        return self.tojson(query)

