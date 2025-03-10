from fastapi import FastAPI

# Create FastAPI app instance
app = FastAPI()

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
