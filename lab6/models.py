from sqlalchemy import String, Integer, Column, Date
from database import Base

class Contract(Base):
    __tablename__ = "contracts"
    id = Column(Integer, primary_key=True, index=True)
    companyName = Column(String, nullable=False)
    type = Column(String, nullable=False)
    validFrom = Column(Date, nullable=False)
    validTo = Column(Date, nullable=False)
