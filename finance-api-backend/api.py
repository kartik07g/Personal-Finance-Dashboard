from fastapi import FastAPI
from Resources.User import user_router
from Resources.UserAuth import user_auth_router
from Resources.Transactions import transaction_router
from Resources.Assets import asset_router
from Resources.Liabilities import liability_router

# Create FastAPI app instance
app = FastAPI()

# Healthcheck endpoint
@app.get("/healthcheck")
def read_root():
    return {"status": "ok"}



app.include_router(user_router)
app.include_router(user_auth_router)
app.include_router(transaction_router)
app.include_router(asset_router)
app.include_router(liability_router)


