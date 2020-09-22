from models import DbModel
import time
class DbService:
    def __init__(self,db):
        self.model = DbModel(db)

    def insertlight(self, light):
        return self.model.insertlight(light)
    def selectlight(self):
        return self.model.selectlight()
    def selectlatestlight(self,minutes):
        return self.model.selectlatestlight(minutes)
    def insertdht(self, params):
        return self.model.insertdht(params[0], params[1])
    def selectdhtafter(self,timestampafter):
        return self.model.selectperioddht(timestampafter, time.time())
    def selectdht(self):
        return self.model.selectdht()
    def selectlatestdht(self, minutes):
        return self.model.selectlastdhts(minutes)
    def selectpots(self):
        return self.model.selectpots()
    def insertpot(self, params):
        return self.model.insertpot(params[0], params[1])
    def selectpotid(self,potId):
        return self.model.selectpot(potId)
    def selectlatestpotsbypotid(self,potId,minutes):
        return self.model.selectlastpots(potId,minutes)
    def selecthumbypotid(self,potId):
        return self.model.selecthumbypotid(potId)
    def selectperiodpots(self,before,after,potId):
        return self.model.selectperiodpots(before,after,potId)