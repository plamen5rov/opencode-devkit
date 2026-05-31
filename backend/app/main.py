from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import config, health

app = FastAPI(
    title="OpenCode DevKit",
    description="Audit, analyze, and optimize OpenCode configuration files",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(config.router)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "OpenCode DevKit API"}
