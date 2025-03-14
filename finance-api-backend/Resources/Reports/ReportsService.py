from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List, Dict
from sqlalchemy.sql import text  # Import SQLAlchemy text for raw queries

class ReportsService:
    def get_report_data(self, report_type: str, db: Session, user_id) -> List[Dict]:
        query_map = {
            "transactions": "SELECT transaction_id, user_id, amount, type, created_at FROM transactions where user_id = :user_id",
            "assets": "SELECT id, name, type, value, created_at FROM assets",
            "liabilities": "SELECT id, name, value, created_at FROM liabilities",
            "assetLiabilities_report" : """SELECT name, 'asset' AS type, value as amount, created_at AS created_dt, updated_at AS updated_dt
        FROM assets
        WHERE user_id = :user_id

        UNION ALL

        SELECT name, 'liability' AS type, amount, created_at AS created_dt, updated_at AS updated_dt
        FROM liabilities
        WHERE user_id = :user_id;"""
        }

        if report_type not in query_map:
            raise HTTPException(status_code=400, detail="Invalid report type")

        query = text(query_map[report_type])  # Convert to SQLAlchemy text query
        result = db.execute(query, {"user_id": user_id})  # Execute the query
        lst = result.mappings().all()

        data = [dict(row) for row in lst]
        return data
