from pydantic import BaseModel
from datetime import date

class ContractCreate(BaseModel):
    companyName: str
    type: str
    validFrom: date
    validTo: date

class ContractResponse(BaseModel):
    id: int
    companyName: str
    type: str
    validFrom: date
    validTo: date
