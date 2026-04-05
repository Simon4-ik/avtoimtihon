from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/subscription", tags=["subscription"])

@router.post("/create")
def create_subscription(user_id: str, plan_type: str, db: Session = Depends(get_db)):
    """Mock creating an order intent. plan_type should be '2week', '1month', or '1year'"""
    # Verify user
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"message": "Order created. Redirecting to payment provider.", "order_id": "dummy-order-123", "plan_type": plan_type}

@router.post("/payment/webhook")
async def payment_webhook(request: Request, user_id: str, plan_type: str, db: Session = Depends(get_db)):
    """Mock webhook for local providers like Payme or Click"""
    # Assuming successful payment confirmation:
    start_date = datetime.utcnow()
    
    if plan_type == '2week':
        end_date = start_date + timedelta(days=14)
    elif plan_type == '1month':
        end_date = start_date + timedelta(days=30)
    elif plan_type == '1year':
        end_date = start_date + timedelta(days=365)
    else:
        raise HTTPException(status_code=400, detail="Invalid plan type")
        
    sub = models.Subscription(
        user_id=user_id,
        plan_type=plan_type,
        start_date=start_date,
        end_date=end_date,
        is_active=True
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    
    return {"status": "Subscription activated", "subscription_id": str(sub.id)}

@router.get("/status")
def get_subscription_status(user_id: str, db: Session = Depends(get_db)):
    sub = db.query(models.Subscription).filter(
        models.Subscription.user_id == user_id, 
        models.Subscription.is_active == True,
        models.Subscription.end_date > datetime.utcnow()
    ).order_by(models.Subscription.end_date.desc()).first()
    
    if not sub:
        return {"has_access": False, "message": "No active subscription"}
        
    return {
        "has_access": True, 
        "plan_type": sub.plan_type, 
        "days_remaining": (sub.end_date - datetime.utcnow()).days
    }
