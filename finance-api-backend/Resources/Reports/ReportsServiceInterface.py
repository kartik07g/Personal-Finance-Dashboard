from abc import ABC, abstractmethod
from typing import List, Dict

class ReportsServiceInterface(ABC):
    @staticmethod
    @abstractmethod
    def get_report_data(report_type, db, user_id):
        pass
