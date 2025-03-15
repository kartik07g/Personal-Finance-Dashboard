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
            "INCOME_VS_EXPENSES_REPORT" :  """SELECT 
                                DATE_TRUNC('month', created_at) AS month, 
                                SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) AS income, 
                                SUM(CASE WHEN type = 'Expenses' THEN amount ELSE 0 END) AS expenses
                                FROM transactions
                                WHERE user_id = :user_id 
                                AND created_at >= DATE_TRUNC('month', NOW()) - INTERVAL '6 months'
                                GROUP BY month
                                ORDER BY month;""",
            "EXPENSES_BREAKDOWN_BY_CATEGORY_REPORT" : """SELECT category, COALESCE(SUM(amount), 0) AS value 
                                FROM transactions 
                                WHERE user_id = :user_id AND type = 'Expenses' 
                                GROUP BY category;""",
            "NETWORTH_REPORT" : """SELECT 
                            (COALESCE(SUM(CASE WHEN type = 'Asset' THEN value ELSE 0 END), 0) - 
                            COALESCE(SUM(CASE WHEN type = 'Liability' THEN value ELSE 0 END), 0)) AS net_worth
                            FROM assets_and_liabilities 
                            WHERE user_id = :user_id;
                            """,
            "TOTAL_INCOME_EXPENSE_NETWORTH_REPORT" : """SELECT 
                        COALESCE(t.total_income, 0) AS total_income,
                        COALESCE(t.total_expenses, 0) AS total_expenses,
                        COALESCE(a.total_assets, 0) - COALESCE(a.total_liabilities, 0) AS net_worth
                    FROM 
                        (SELECT 
                            user_id, 
                            SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) AS total_income,
                            SUM(CASE WHEN type = 'Expenses' THEN amount ELSE 0 END) AS total_expenses
                        FROM transactions
                        WHERE user_id = :user_id
                        GROUP BY user_id) t
                    LEFT JOIN 
                        (SELECT 
                            user_id, 
                            SUM(CASE WHEN type = 'Asset' THEN value ELSE 0 END) AS total_assets,
                            SUM(CASE WHEN type = 'Liability' THEN value ELSE 0 END) AS total_liabilities
                        FROM assets_and_liabilities
                        WHERE user_id = :user_id
                        GROUP BY user_id) a
                    ON t.user_id = a.user_id;"""
                }

        if report_type not in query_map:
            raise HTTPException(status_code=400, detail="Invalid report type")

        query = text(query_map[report_type])  # Convert to SQLAlchemy text query
        result = db.execute(query, {"user_id": user_id})  # Execute the query
        lst = result.mappings().all()

        data ={ report_type : [dict(row) for row in lst]
        } 
        return data
