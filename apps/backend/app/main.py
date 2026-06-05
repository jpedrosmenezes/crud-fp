from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import datetime as dt
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))
import anthropic 

app = FastAPI()

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

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

#TREINOS
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

#EXERCICIOS
def save_exercicios(exercicios):
    dir_failsafe()

    with open(ARQ_EXERCICIOS, "w", encoding="utf-8") as f:
        for c in exercicios:
            linha = "|".join([
                c.get("nome", ""),
                c.get("treino", ""),
                c.get("modo", ""),
                str(c.get("series", 0)),
                str(c.get("repeticoes", 0)),
                str(c.get("tempo", 0)),
                str(c.get("distancia", 0))
            ])

            f.write(linha + "\n")

def load_exercicios():
    dir_failsafe()

    exercicios = []
    if not os.path.exists(ARQ_EXERCICIOS):
        return exercicios
           
    with open(ARQ_EXERCICIOS, "r", encoding="utf-8") as f:
        for linha in f:
            data = linha.strip().split("|")
            
            if len(data) >= 7:
                exercicios.append({
                    "nome": data[0],
                    "treino": data[1],
                    "modo": data[2],
                    "series": data[3],
                    "repeticoes": data[4],
                    "tempo": data[5],
                    "distancia": data[6]
                })

    return exercicios

#METAS
def save_metas(metas):
    dir_failsafe()

    with open(ARQ_METAS, "w", encoding="utf-8") as f:
        for m in metas:
            linha = "|".join([
                m.get("descricao", ""),
                m.get("prazo", ""),
                m.get("status", "Em andamento")
            ])

            f.write(linha + "\n")

def load_metas():
    dir_failsafe()
    metas = []

    if not os.path.exists(ARQ_METAS):
        return metas

    with open(ARQ_METAS, "r", encoding="utf-8") as f:
        for linha in f:
            data = linha.strip().split("|")

            if len(data) >= 3:
                metas.append({
                    "descricao": data[0],
                    "prazo": data[1],
                    "status": data[2]
                })

    return metas

#EVOLUCOES
def save_evolucoes(evolucoes):
    dir_failsafe()

    with open(ARQ_EVOLUCAO, "w", encoding="utf-8") as f:
        for e in evolucoes:
            linha = "|".join([
                e.get("data", ""),
                str(e.get("peso", 0)),
                str(e.get("altura", 0)),
                str(e.get("gordura", 0))
            ])

            f.write(linha + "\n")

def load_evolucoes():
    dir_failsafe()
    evolucoes = []

    if not os.path.exists(ARQ_EVOLUCAO):
        return evolucoes

    with open(ARQ_EVOLUCAO, "r", encoding="utf-8") as f:
        for linha in f:
            data = linha.strip().split("|")

            if len(data) >= 4:
                evolucoes.append({
                    "data": data[0],
                    "peso": data[1],
                    "altura": data[2],
                    "gordura": data[3]
                })

    return evolucoes

#ROTAS TREINOS
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

@app.put("/treinos/{nome}")
async def edit_treino(nome: str, data: dict = Body(...)):
    treinos = load_treinos()

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

    save_treinos(treinos)
    return {"ok": True}
        
@app.delete("/treinos/{nome}")
async def delete_treino(nome: str):
    treinos = load_treinos()
    filtered_treinos = [c for c in treinos if c["nome"] != nome]

    if len(filtered_treinos) == len(treinos):
        raise HTTPException(status_code=404, detail="Treino não encontrado")
    
    save_treinos(filtered_treinos)

    exercicios = load_exercicios()
    save_exercicios([e for e in exercicios if e["treino"] != nome])

    return {"ok": True}

#ROTAS EXERCICIOS
@app.get("/exercicios")
async def get_exercicios(treino: str = None):
    exercicios = load_exercicios()
    if treino:
        exercicios = [e for e in exercicios if e["treino"] == treino]
    
    return exercicios

@app.post("/exercicios")
async def post_exercicios(data: dict = Body(...)):
    if not data.get("nome"):
        raise HTTPException(status_code=400, detail="Nome obrigatório")
    
    exercicios = load_exercicios()
    exercicios.append({
        "nome": data.get("nome", ""),
        "treino": data.get("treino", ""),
        "modo": data.get("modo", "series"),
        "series": str(data.get("series", 0)),
        "repeticoes": str(data.get("repeticoes", 0)),
        "tempo": str(data.get("tempo", 0)),
        "distancia": str(data.get("distancia", 0))
    })
    save_exercicios(exercicios)

    return {"ok": True}

@app.put("/exercicios/{index}")
async def edit_exercicios(index: int, data: dict = Body(...)):
    exercicios = load_exercicios()

    if index < 0 or index >= len(exercicios):
        raise HTTPException(status_code=404, detail="Exercício não encontrado")
    
    exercicios[index]["nome"] = data.get("nome", exercicios[index]["nome"])
    exercicios[index]["treino"] = data.get("treino", exercicios[index]["treino"])
    exercicios[index]["modo"] = data.get("modo", exercicios[index]["modo"])
    exercicios[index]["series"] = data.get("series", exercicios[index]["series"])
    exercicios[index]["repeticoes"] = data.get("repeticoes", exercicios[index]["repeticoes"])
    exercicios[index]["tempo"] = data.get("tempo", exercicios[index]["tempo"])
    exercicios[index]["distancia"] = data.get("distancia", exercicios[index]["distancia"])

    save_exercicios(exercicios)
    return {"ok": True}

@app.delete("/exercicios/{index}")
async def delete_exercicios(index: int):
    exercicios = load_exercicios()

    if index < 0 or index >= len(exercicios):
        raise HTTPException(status_code=404, detail="Exercício não encontrado")
    
    exercicios.pop(index)
    save_exercicios(exercicios)

    return {"ok": True}

#ROTAS METAS
@app.get("/metas")
async def get_metas():
    return load_metas()

@app.post("/metas")
async def post_metas(data: dict = Body(...)):
    if not data.get("descricao"):
        raise HTTPException(status_code=400, detail="Descrição obrigatória")
    
    metas = load_metas()
    metas.append({
        "descricao": data.get("descricao", ""),
        "prazo": data.get("prazo", ""),
        "status": data.get("status", "Em andamento")
    })
    save_metas(metas)

    return {"ok": True}

@app.put("/metas/{index}")
async def edit_meta(index: int, data: dict = Body(...)):
    metas = load_metas()

    if index < 0 or index >= len(metas):
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    
    metas[index]["descricao"] = data.get("descricao", metas[index]["descricao"])
    metas[index]["prazo"] = data.get("prazo", metas[index]["prazo"])
    metas[index]["status"] = data.get("status", metas[index]["status"])

    save_metas(metas)
    return {"ok": True}

@app.delete("/metas/{index}")
async def delete_meta(index: int):
    metas = load_metas()

    if index < 0 or index >= len(metas):
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    
    metas.pop(index)
    save_metas(metas)

    return {"ok": True}

#ROTAS EVOLUCOES
@app.get("/evolucoes")
async def get_sugestoes(objetivo: str = None):
    return sujest(objetivo)

@app.post("/evolucoes")
async def post_evolucoes(data: dict = Body(...)):
    if not data.get("data"):
        raise HTTPException(status_code=400, detail="Data obrigatória")
    
    evolucoes = load_evolucoes()
    evolucoes.append({
        "data": data.get("data", ""),
        "peso": data.get("peso", ""),
        "altura": data.get("altura", ""),
        "gordura": data.get("gordura", "")
    })
    save_evolucoes(evolucoes)

    return {"ok": True}

@app.put("/evolucoes/{index}")
async def edit_evolucoes(index: int, data: dict = Body(...)):
    evolucoes = load_evolucoes()

    if index < 0 or index >= len(evolucoes):
        raise HTTPException(status_code=404, detail="Evoluções não encontrada")
    
    evolucoes[index]["data"] = data.get("data", evolucoes[index]["data"])
    evolucoes[index]["peso"] = data.get("peso", evolucoes[index]["peso"])
    evolucoes[index]["altura"] = data.get("altura", evolucoes[index]["altura"])
    evolucoes[index]["gordura"] = data.get("gordura", evolucoes[index]["gordura"])

    save_evolucoes(evolucoes)
    return {"ok": True}

@app.delete("/evolucoes/{index}")
async def delete_evolucoes(index:int):
    evolucoes = load_evolucoes()

    if index < 0 or index >= len(evolucoes):
        raise HTTPException(status_code=404, detail="Evoluções não encontrada")
    
    evolucoes.pop(index)
    save_evolucoes(evolucoes)

    return {"ok": True}

def sujest(objetivo_usuario=None):

    sugestoes = {
        "Hipertrofia": {
            "nome": "Sugestão: peito e tríceps",
            "tipo": "Musculação",
            "data": dt.date.today().strftime("%d/%m/%Y"),
            "duracao": "60 min",
            "objetivo": "Hipertrofia",
            "meta": "Ganho de massa magra"
        },
        "Emagrecimento": {
            "nome": "Sujestão: corrida",
            "tipo": "Cardio / Funcional",
            "data": dt.date.today().strftime("%d/%m/%Y"),
            "duracao": "45 min",
            "objetivo": "Emagrecimento",
            "meta": "Déficit calórico"
        }
    }
        
    lista_treinos = []
    if os.path.exists(ARQ_TREINOS):
        with open(ARQ_TREINOS, "r", encoding="utf-8") as f:
            for linha in f:
                linha = linha.strip()
                if not linha:
                    continue
                partes = linha.split("|")
                if len(partes) >= 6:
                    lista_treinos.append({
                        "nome": partes[0],
                        "tipo": partes[1],
                        "data": partes[2],
                        "duracao": partes[3],
                        "objetivo": partes[4],
                        "meta": partes[5]
                    })
    
    if len(lista_treinos) > 0:
        return {"origem": "arquivo", "dados": lista_treinos}
    
    if objetivo_usuario in sugestoes:
        return {"origem": "sugestao", "dados": [sugestoes[objetivo_usuario]]}
        
    return {"origem": "nenhum", "dados": []}

# ROTA AGENTE
def montar_contexto():
    treinos = load_treinos()
    exercicios = load_exercicios()
    metas = load_metas()
    evolucoes = load_evolucoes()

    contexto = "Você é um assistente personal trainer inteligente. Responda em português.\n\n"

    contexto += "=== TREINOS DO USUÁRIO ===\n"
    for t in treinos:
        contexto += f"- {t['nome']} | Tipo: {t['tipo']} | Data: {t['data']} | Duração: {t['duracao']} | Objetivo: {t['objetivo']} | Meta: {t['meta']}\n"

    contexto += "\n=== EXERCÍCIOS ===\n"
    for e in exercicios:
        contexto += f"- {e['nome']} | Treino: {e['treino']} | Modo: {e['modo']} | Séries: {e['series']} | Reps: {e['repeticoes']} | Tempo: {e['tempo']}min | Distância: {e['distancia']}km\n"

    contexto += "\n=== METAS ===\n"
    for m in metas:
        contexto += f"- {m['descricao']} | Prazo: {m['prazo']} | Status: {m['status']}\n"

    contexto += "\n=== EVOLUÇÃO FÍSICA ===\n"
    for ev in evolucoes:
        contexto += f"- Data: {ev['data']} | Peso: {ev['peso']}kg | Altura: {ev['altura']}m | Gordura: {ev['gordura']}%\n"

    return contexto


@app.post("/agente")
async def agente(data: dict = Body(...)):
    pergunta = data.get("pergunta", "").strip()

    if not pergunta:
        raise HTTPException(status_code=400, detail="Pergunta obrigatória")

    contexto = montar_contexto()

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": f"{contexto}\n\nPergunta do usuário: {pergunta}"
            }
        ]
    )

    resposta = message.content[0].text
    return {"resposta": resposta}