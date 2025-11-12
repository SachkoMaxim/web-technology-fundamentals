from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Base, Contract
from database import engine, get_db
from schemas import ContractCreate, ContractResponse

app = FastAPI()
Base.metadata.create_all(bind=engine)

@app.post("/contracts/", response_model=ContractResponse, status_code=201)
def create_contract(contract: ContractCreate, db: Session = Depends(get_db)):
    db_contract = Contract(**contract.model_dump())
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)
    return db_contract

@app.get("/contracts/{contract_id}", response_model=ContractResponse)
def read_contract(contract_id: int, db: Session = Depends(get_db)):
    db_contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if db_contract is None:
        raise HTTPException(status_code=404, detail=f"Contract with id {contract_id} not found")
    return db_contract

@app.get("/contracts/", response_model=list[ContractResponse])
def read_contracts(db: Session = Depends(get_db)):
    return db.query(Contract).all()

@app.put("/contracts/{contract_id}", response_model=ContractResponse)
def update_contract(contract_id: int, updated_contract: ContractCreate, db: Session = Depends(get_db)):
    db_contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if db_contract is None:
        raise HTTPException(status_code=404, detail=f"Contract with id {contract_id} not found")

    for key, value in updated_contract.model_dump().items():
        setattr(db_contract, key, value)

    db.commit()
    db.refresh(db_contract)
    return db_contract

@app.delete("/contracts/{contract_id}", response_model=dict)
def delete_contract(contract_id: int, db: Session = Depends(get_db)):
    db_contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if db_contract is None:
        raise HTTPException(status_code=404, detail=f"Contract with id {contract_id} not found")

    db.delete(db_contract)
    db.commit()
    return {"detail": f"Contract with id {contract_id} deleted"}
