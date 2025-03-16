from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List, Dict
from sqlalchemy.sql import text  # Import SQLAlchemy text for raw queries
import os

class ReportsService:
    def get_report_data(self, report_type: str, db: Session, user_id) -> List[Dict]:

        query = text(os.getenv(report_type))  # Convert to SQLAlchemy text query
        result = db.execute(query, {"user_id": user_id})  # Execute the query
        lst = result.mappings().all()

        data ={ report_type : [dict(row) for row in lst]
        } 
        return data
