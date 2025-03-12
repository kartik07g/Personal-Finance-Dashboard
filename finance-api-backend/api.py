from fastapi import FastAPI
from Resources.User import user_router
from Resources.UserAuth import user_auth_router

# Create FastAPI app instance
app = FastAPI()

app.include_router(user_router)
app.include_router(user_auth_router)
# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI!"}

# Example GET endpoint
@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "query": q}

# Example POST endpoint
@app.post("/items/")
def create_item(item: dict):
    return {"message": "Item created successfully", "item": item}
