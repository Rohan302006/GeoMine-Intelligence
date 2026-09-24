from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import CoalProduction, Dispatch, CoalResource
from app.schemas.schemas import CoalProductionItem, DispatchItem, CoalResourceItem

router = APIRouter(prefix="/coal", tags=["Coal Statistics"])

@router.get("/production", response_model=List[CoalProductionItem])
def get_production_data(
    year: Optional[str] = None,
    subsidiary: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(CoalProduction)
    if year:
        q = q.filter(CoalProduction.year == year)
    if subsidiary and subsidiary != "All":
        q = q.filter(CoalProduction.subsidiary == subsidiary)
    return q.all()

@router.get("/dispatch", response_model=List[DispatchItem])
def get_dispatch_data(year: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Dispatch)
    if year:
        q = q.filter(Dispatch.year == year)
    return q.all()

@router.get("/resources", response_model=List[CoalResourceItem])
def get_resources_data(db: Session = Depends(get_db)):
    return db.query(CoalResource).all()
