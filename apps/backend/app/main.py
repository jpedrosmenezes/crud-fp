from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import datetime as dt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ARQ_TREINOS = os.path.join(BASE_DIR, "data", "treinos.txt")
ARQ_EXERCICIOS = os.path.join(BASE_DIR, "data", "exercicios.txt")
ARQ_METAS = os.path.join(BASE_DIR, "data", "metas.txt")
ARQ_EVOLUCAO = os.path.join(BASE_DIR, "data", "evolucao.txt")

def dir_failsafe():
    os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)


def save_treinos(treinos):
    dir_failsafe()

    with open(ARQ_TREINOS, "w", encoding="utf-8") as f:
        for c in treinos:
            linha = "|".join([
                c.get("nome", ""),
                c.get("tipo", ""),
                c.get("data", ""),
                c.get("duracao", ""),
                c.get("objetivo", ""),
                c.get("meta", "")
            ])

            f.write(linha + "\n")

def load_treinos():
    dir_failsafe()

    treinos = []
    if not os.path.exists(ARQ_TREINOS):
        return treinos

    with open(ARQ_TREINOS, "r", encoding="utf-8") as f:
        for linha in f:
            data = linha.strip().split("|")

            if len(data) >= 4:
                treinos.append({
                    "nome": data[0],
                    "tipo": data[1],
                    "data": data[2],
                    "duracao": data[3],
                    "objetivo": data[4] if len(data) > 4 else "",
                    "meta": data[5] if len(data) > 5 else ""
                })
    return treinos

@app.get("/treinos")
async def get_treinos():
    return load_treinos()

@app.post("/treinos", status_code=201)
async def post_treino(data: dict = Body(...)):
    if not data.get("nome"):
        raise HTTPException(status_code=400, detail="Nome obrigatório")

    treinos = load_treinos()
    treinos.append({
        "nome": data.get("nome", ""),
        "tipo": data.get("tipo", ""),
        "data": data.get("data", ""),
        "duracao": data.get("duracao", ""),
        "objetivo": data.get("objetivo", ""),
        "meta": data.get("meta", "")
    })
    save_treinos(treinos)

    return {"ok": True}
