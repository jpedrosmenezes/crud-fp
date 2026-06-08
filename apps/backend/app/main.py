from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
import os
import datetime as dt
from dotenv import load_dotenv

load_dotenv(
    dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env")
)
import anthropic

app = FastAPI()

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USUARIOS_DIR = os.path.join(BASE_DIR, "data", "usuarios")
ARQ_USUARIOS = os.path.join(BASE_DIR, "data", "usuarios.txt")


def dir_failsafe(usuario: str = None):
    os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)
    os.makedirs(USUARIOS_DIR, exist_ok=True)
    if usuario:
        os.makedirs(os.path.join(USUARIOS_DIR, usuario), exist_ok=True)


# USUARIOS
def get_usuario_path(usuario: str, arquivo: str) -> str:
    return os.path.join(USUARIOS_DIR, usuario, arquivo)


def load_usuarios() -> list[str]:
    dir_failsafe()
    if not os.path.exists(ARQ_USUARIOS):
        return []
    with open(ARQ_USUARIOS, "r", encoding="utf-8") as f:
        return [linha.strip() for linha in f if linha.strip()]


def usuario_existe(nome: str) -> bool:
    return nome.lower() in [u.lower() for u in load_usuarios()]


def criar_usuario(nome: str):
    dir_failsafe(nome)
    with open(ARQ_USUARIOS, "a", encoding="utf-8") as f:
        f.write(nome + "\n")


def checar_usuario(usuario: str):
    if not usuario_existe(usuario):
        raise HTTPException(status_code=404, detail="Usuário não encontrado")


# TREINOS
def save_treinos(usuario: str, treinos: list):
    dir_failsafe(usuario)
    path = get_usuario_path(usuario, "treinos.txt")
    with open(path, "w", encoding="utf-8") as f:
        for c in treinos:
            linha = "|".join(
                [
                    c.get("nome", ""),
                    c.get("tipo", ""),
                    c.get("data", ""),
                    c.get("duracao", ""),
                    c.get("objetivo", ""),
                    c.get("meta", ""),
                ]
            )
            f.write(linha + "\n")


def load_treinos(usuario: str) -> list:
    dir_failsafe(usuario)
    path = get_usuario_path(usuario, "treinos.txt")
    treinos = []
    if not os.path.exists(path):
        return treinos
    with open(path, "r", encoding="utf-8") as f:
        for linha in f:
            data = linha.strip().split("|")
            if len(data) >= 4:
                treinos.append(
                    {
                        "nome": data[0],
                        "tipo": data[1],
                        "data": data[2],
                        "duracao": data[3],
                        "objetivo": data[4] if len(data) > 4 else "",
                        "meta": data[5] if len(data) > 5 else "",
                    }
                )
    return treinos


# EXERCICIOS
def save_exercicios(usuario: str, exercicios: list):
    dir_failsafe(usuario)
    path = get_usuario_path(usuario, "exercicios.txt")
    with open(path, "w", encoding="utf-8") as f:
        for c in exercicios:
            linha = "|".join(
                [
                    c.get("nome", ""),
                    c.get("treino", ""),
                    c.get("modo", ""),
                    str(c.get("series", 0)),
                    str(c.get("repeticoes", 0)),
                    str(c.get("tempo", 0)),
                    str(c.get("distancia", 0)),
                ]
            )
            f.write(linha + "\n")


def load_exercicios(usuario: str) -> list:
    dir_failsafe(usuario)
    path = get_usuario_path(usuario, "exercicios.txt")
    exercicios = []
    if not os.path.exists(path):
        return exercicios
    with open(path, "r", encoding="utf-8") as f:
        for linha in f:
            data = linha.strip().split("|")
            if len(data) >= 7:
                exercicios.append(
                    {
                        "nome": data[0],
                        "treino": data[1],
                        "modo": data[2],
                        "series": data[3],
                        "repeticoes": data[4],
                        "tempo": data[5],
                        "distancia": data[6],
                    }
                )
    return exercicios


# METAS
def save_metas(usuario: str, metas: list):
    dir_failsafe(usuario)
    path = get_usuario_path(usuario, "metas.txt")
    with open(path, "w", encoding="utf-8") as f:
        for m in metas:
            linha = "|".join(
                [
                    str(m.get("descricao", "")),
                    str(m.get("prazo", "")),
                    str(m.get("status", "Em andamento")),
                ]
            )
            f.write(linha + "\n")


def load_metas(usuario: str) -> list:
    dir_failsafe(usuario)
    path = get_usuario_path(usuario, "metas.txt")
    metas = []
    if not os.path.exists(path):
        return metas
    with open(path, "r", encoding="utf-8") as f:
        for linha in f:
            data = linha.strip().split("|")
            if len(data) >= 3:
                metas.append(
                    {"descricao": data[0], "prazo": data[1], "status": data[2]}
                )
    return metas


# EVOLUCOES
def save_evolucoes(usuario: str, evolucoes: list):
    dir_failsafe(usuario)
    path = get_usuario_path(usuario, "evolucao.txt")
    with open(path, "w", encoding="utf-8") as f:
        for e in evolucoes:
            linha = "|".join(
                [
                    e.get("data", ""),
                    str(e.get("peso", 0)),
                    str(e.get("altura", 0)),
                    str(e.get("gordura", 0)),
                ]
            )
            f.write(linha + "\n")


def load_evolucoes(usuario: str) -> list:
    dir_failsafe(usuario)
    path = get_usuario_path(usuario, "evolucao.txt")
    evolucoes = []
    if not os.path.exists(path):
        return evolucoes
    with open(path, "r", encoding="utf-8") as f:
        for linha in f:
            data = linha.strip().split("|")
            if len(data) >= 4:
                evolucoes.append(
                    {
                        "data": data[0],
                        "peso": data[1],
                        "altura": data[2],
                        "gordura": data[3],
                    }
                )
    return evolucoes


# ROTAS USUARIO
@app.get("/usuarios")
async def get_usuarios():
    return {"usuarios": load_usuarios()}


@app.post("/login")
async def login(data: dict = Body(...)):
    nome = data.get("nome", "").strip()

    if not nome:
        raise HTTPException(status_code=400, detail="Nome obrigatório")

    if not usuario_existe(nome):
        criar_usuario(nome)
        return {"ok": True, "criado": True, "usuario": nome}

    usuarios = load_usuarios()
    nome_salvo = next(u for u in usuarios if u.lower() == nome.lower())
    return {"ok": True, "criado": False, "usuario": nome_salvo}


# ROTAS TREINOS
@app.get("/treinos/{usuario}")
async def get_treinos(usuario: str):
    checar_usuario(usuario)
    return load_treinos(usuario)


@app.post("/treinos/{usuario}", status_code=201)
async def post_treino(usuario: str, data: dict = Body(...)):
    checar_usuario(usuario)
    if not data.get("nome"):
        raise HTTPException(status_code=400, detail="Nome obrigatório")
    treinos = load_treinos(usuario)
    if any(t["nome"].lower() == data["nome"].lower() for t in treinos):
        raise HTTPException(status_code=409, detail="Já existe um treino com esse nome")
    treinos.append({
        "nome":     data.get("nome", ""),
        "tipo":     data.get("tipo", ""),
        "data":     data.get("data", ""),
        "duracao":  data.get("duracao", ""),
        "objetivo": data.get("objetivo", ""),
        "meta":     data.get("meta", "")
    })
    save_treinos(usuario, treinos)
    return {"ok": True}


@app.put("/treinos/{usuario}/{nome}")
async def edit_treino(usuario: str, nome: str, data: dict = Body(...)):
    checar_usuario(usuario)
    treinos = load_treinos(usuario)
    for c in treinos:
        if c["nome"] == nome:
            c["tipo"] = data.get("tipo", c["tipo"])
            c["data"] = data.get("data", c["data"])
            c["duracao"] = data.get("duracao", c["duracao"])
            c["objetivo"] = data.get("objetivo", c["objetivo"])
            c["meta"] = data.get("meta", c["meta"])
            break
    else:
        raise HTTPException(status_code=404, detail="Treino não encontrado")
    save_treinos(usuario, treinos)
    return {"ok": True}


@app.delete("/treinos/{usuario}/{nome}")
async def delete_treino(usuario: str, nome: str):
    checar_usuario(usuario)
    treinos = load_treinos(usuario)
    filtered = [c for c in treinos if c["nome"] != nome]
    if len(filtered) == len(treinos):
        raise HTTPException(status_code=404, detail="Treino não encontrado")
    save_treinos(usuario, filtered)
    exercicios = load_exercicios(usuario)
    save_exercicios(usuario, [e for e in exercicios if e["treino"] != nome])
    return {"ok": True}


# ROTAS EXERCICIOS
@app.get("/exercicios/{usuario}")
async def get_exercicios(usuario: str, treino: str = None):
    checar_usuario(usuario)
    exercicios = load_exercicios(usuario)
    if treino:
        exercicios = [e for e in exercicios if e["treino"] == treino]
    return exercicios


@app.post("/exercicios/{usuario}", status_code=201)
async def post_exercicios(usuario: str, data: dict = Body(...)):
    checar_usuario(usuario)
    if not data.get("nome"):
        raise HTTPException(status_code=400, detail="Nome obrigatório")
    exercicios = load_exercicios(usuario)
    if any(
        e["nome"].lower() == data["nome"].lower() and
        e["treinos"].lower() == data.get["treinos", ""].lower()
        for e in exercicios
    ):
        raise HTTPException(status_code=409, detail="Já existe um exercício com esse nome nesse treino")
    exercicios.append({
        "nome":       data.get("nome", ""),
        "treino":     data.get("treino", ""),
        "modo":       data.get("modo", "series"),
        "series":     str(data.get("series", 0)),
        "repeticoes": str(data.get("repeticoes", 0)),
        "tempo":      str(data.get("tempo", 0)),
        "distancia":  str(data.get("distancia", 0))
    })
    save_exercicios(usuario, exercicios)
    return {"ok": True}


@app.put("/exercicios/{usuario}/{index}")
async def edit_exercicios(usuario: str, index: int, data: dict = Body(...)):
    checar_usuario(usuario)
    exercicios = load_exercicios(usuario)
    if index < 0 or index >= len(exercicios):
        raise HTTPException(status_code=404, detail="Exercício não encontrado")
    exercicios[index]["nome"] = data.get("nome", exercicios[index]["nome"])
    exercicios[index]["treino"] = data.get("treino", exercicios[index]["treino"])
    exercicios[index]["modo"] = data.get("modo", exercicios[index]["modo"])
    exercicios[index]["series"] = data.get("series", exercicios[index]["series"])
    exercicios[index]["repeticoes"] = data.get(
        "repeticoes", exercicios[index]["repeticoes"]
    )
    exercicios[index]["tempo"] = data.get("tempo", exercicios[index]["tempo"])
    exercicios[index]["distancia"] = data.get(
        "distancia", exercicios[index]["distancia"]
    )
    save_exercicios(usuario, exercicios)
    return {"ok": True}


@app.delete("/exercicios/{usuario}/{index}")
async def delete_exercicios(usuario: str, index: int):
    checar_usuario(usuario)
    exercicios = load_exercicios(usuario)
    if index < 0 or index >= len(exercicios):
        raise HTTPException(status_code=404, detail="Exercício não encontrado")
    exercicios.pop(index)
    save_exercicios(usuario, exercicios)
    return {"ok": True}


# ROTAS METAS
@app.get("/metas/{usuario}")
async def get_metas(usuario: str):
    checar_usuario(usuario)
    return load_metas(usuario)


@app.post("/metas/{usuario}", status_code=201)
async def post_metas(usuario: str, data: dict = Body(...)):
    checar_usuario(usuario)
    if not data.get("descricao"):
        raise HTTPException(status_code=400, detail="Descrição obrigatória")
    metas = load_metas(usuario)
    if any(m["descricao"].lower() == data["descricao"].lower() for m in metas):
        raise HTTPException(status_code=409, detail="Já existe uma meta com essa descrição")
    metas.append({
        "descricao": data.get("descricao", ""),
        "prazo":     data.get("prazo", ""),
        "status":    data.get("status", "Em andamento")
    })
    save_metas(usuario, metas)
    return {"ok": True}


@app.put("/metas/{usuario}/{index}")
async def edit_meta(usuario: str, index: int, data: dict = Body(...)):
    checar_usuario(usuario)
    metas = load_metas(usuario)
    if index < 0 or index >= len(metas):
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    metas[index]["descricao"] = data.get("descricao", metas[index]["descricao"])
    metas[index]["prazo"] = data.get("prazo", metas[index]["prazo"])
    metas[index]["status"] = data.get("status", metas[index]["status"])
    save_metas(usuario, metas)
    return {"ok": True}


@app.delete("/metas/{usuario}/{index}")
async def delete_meta(usuario: str, index: int):
    checar_usuario(usuario)
    metas = load_metas(usuario)
    if index < 0 or index >= len(metas):
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    metas.pop(index)
    save_metas(usuario, metas)
    return {"ok": True}


# ROTAS EVOLUCOES
@app.get("/evolucoes/{usuario}")
async def get_evolucoes(usuario: str):
    checar_usuario(usuario)
    return load_evolucoes(usuario)


@app.post("/evolucoes/{usuario}", status_code=201)
async def post_evolucoes(usuario: str, data: dict = Body(...)):
    checar_usuario(usuario)
    if not data.get("data"):
        raise HTTPException(status_code=400, detail="Data obrigatória")
    evolucoes = load_evolucoes(usuario)
    if any(e["data"] == data["data"] for e in evolucoes):
        raise HTTPException(status_code=409, detail="Já existe um registro de evolução nessa data")
    evolucoes.append({
        "data":    data.get("data", ""),
        "peso":    data.get("peso", ""),
        "altura":  data.get("altura", ""),
        "gordura": data.get("gordura", "")
    })
    save_evolucoes(usuario, evolucoes)
    return {"ok": True}


@app.put("/evolucoes/{usuario}/{index}")
async def edit_evolucoes(usuario: str, index: int, data: dict = Body(...)):
    checar_usuario(usuario)
    evolucoes = load_evolucoes(usuario)
    if index < 0 or index >= len(evolucoes):
        raise HTTPException(status_code=404, detail="Evolução não encontrada")
    evolucoes[index]["data"] = data.get("data", evolucoes[index]["data"])
    evolucoes[index]["peso"] = data.get("peso", evolucoes[index]["peso"])
    evolucoes[index]["altura"] = data.get("altura", evolucoes[index]["altura"])
    evolucoes[index]["gordura"] = data.get("gordura", evolucoes[index]["gordura"])
    save_evolucoes(usuario, evolucoes)
    return {"ok": True}


@app.delete("/evolucoes/{usuario}/{index}")
async def delete_evolucoes(usuario: str, index: int):
    checar_usuario(usuario)
    evolucoes = load_evolucoes(usuario)
    if index < 0 or index >= len(evolucoes):
        raise HTTPException(status_code=404, detail="Evolução não encontrada")
    evolucoes.pop(index)
    save_evolucoes(usuario, evolucoes)
    return {"ok": True}


# SUGESTOES
def sugest(usuario: str, objetivo_usuario=None):
    sugestoes = {
        "Hipertrofia": {
            "nome": "Sugestão: peito e tríceps",
            "tipo": "Musculação",
            "data": dt.date.today().strftime("%d/%m/%Y"),
            "duracao": "60 min",
            "objetivo": "Hipertrofia",
            "meta": "Ganho de massa magra",
        },
        "Emagrecimento": {
            "nome": "Sugestão: corrida",
            "tipo": "Cardio / Funcional",
            "data": dt.date.today().strftime("%d/%m/%Y"),
            "duracao": "45 min",
            "objetivo": "Emagrecimento",
            "meta": "Déficit calórico",
        },
    }

    lista_treinos = load_treinos(usuario)

    if lista_treinos:
        return {"origem": "arquivo", "dados": lista_treinos}

    if objetivo_usuario in sugestoes:
        return {"origem": "sugestao", "dados": [sugestoes[objetivo_usuario]]}

    return {"origem": "nenhum", "dados": []}


@app.get("/sugestoes/{usuario}")
async def get_sugestoes(usuario: str, objetivo: str = None):
    checar_usuario(usuario)
    return sugest(usuario, objetivo)


# AGENTE
def montar_contexto(usuario: str):
    treinos = load_treinos(usuario)
    exercicios = load_exercicios(usuario)
    metas = load_metas(usuario)
    evolucoes = load_evolucoes(usuario)

    contexto = (
        f"Você é um assistente personal trainer inteligente. Responda em português.\n"
    )
    contexto += f"Você está atendendo o usuário: {usuario}\n\n"

    contexto += "=== TREINOS DO USUÁRIO ===\n"
    for t in treinos:
        contexto += f"- {t['nome']} | Tipo: {t['tipo']} | Data: {t['data']} | Duração: {t['duracao']} | Objetivo: {t['objetivo']} | Meta: {t['meta']}\n"

    contexto += "\n=== EXERCÍCIOS ===\n"
    for e in exercicios:
        contexto += f"- {e['nome']} | Treino: {e['treino']} | Modo: {e['modo']} | Séries: {e['series']} | Reps: {e['repeticoes']} | Tempo: {e['tempo']}min | Distância: {e['distancia']}km\n"

    contexto += "\n=== METAS ===\n"
    for m in metas:
        contexto += (
            f"- {m['descricao']} | Prazo: {m['prazo']} | Status: {m['status']}\n"
        )

    contexto += "\n=== EVOLUÇÃO FÍSICA ===\n"
    for ev in evolucoes:
        contexto += f"- Data: {ev['data']} | Peso: {ev['peso']}kg | Altura: {ev['altura']}m | Gordura: {ev['gordura']}%\n"

    return contexto


@app.post("/agente/{usuario}")
async def agente(usuario: str, data: dict = Body(...)):
    checar_usuario(usuario)
    pergunta = data.get("pergunta", "").strip()
    if not pergunta:
        raise HTTPException(status_code=400, detail="Pergunta obrigatória")

    contexto = montar_contexto(usuario)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": f"{contexto}\n\nPergunta do usuário: {pergunta}",
            }
        ],
    )
    resposta = message.content[0].text
    return {"resposta": resposta}


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Custom title",
        version="2.5.0",
        summary="This is a very custom OpenAPI schema",
        description="Here's a longer description of the custom **OpenAPI** schema",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi
