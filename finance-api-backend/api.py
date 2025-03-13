from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Resources.User import user_router
from Resources.UserAuth import user_auth_router
from Resources.Transactions import transaction_router
from Resources.Assets import asset_router
from Resources.Liabilities import liability_router

# Create FastAPI app instance
app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Healthcheck endpoint
@app.get("/backend/healthcheck")
def read_root():
    return {"status": "ok"}



app.include_router(user_router)
app.include_router(user_auth_router)
app.include_router(transaction_router)
app.include_router(asset_router)
app.include_router(liability_router)


