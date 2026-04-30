from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import partida, diagramas

app = FastAPI(title="EtNós API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(partida.router,   prefix="/partida",   tags=["partida"])
app.include_router(diagramas.router, prefix="/diagramas", tags=["diagramas"])


@app.get("/")
def root():
    return {"status": "EtNós API online"}
