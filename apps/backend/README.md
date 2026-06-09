# Backend API

Backend da aplicação desenvolvido com FastAPI.

---

# 🚀 Tecnologias

- Python
- FastAPI
- Uvicorn

---

# 📁 Estrutura

```txt
backend/
├── app/
│   ├── data/
│   └── main.py
├── README.md
└── requirements.txt
```

---

# ⚙️ Instalação

## Criando ambiente virtual

### Linux / macOS

```bash
python3 -m venv .venv
```

### Windows

```powershell
python -m venv .venv
```

---

# ▶️ Ativando ambiente virtual

### Linux / macOS

```bash
source .venv/bin/activate
```

### Windows

```powershell
.venv\Scripts\activate
```

---

# 📦 Instalando dependências

```bash
pip install -r requirements.txt
```

---

# 🧪 Rodando em desenvolvimento

```bash
uvicorn app.main:app --reload
```

---

# 🌐 Endpoints

## API

```txt
http://127.0.0.1:8000
```

## Swagger

```txt
http://127.0.0.1:8000/docs
```

---

# 🏗️ Produção

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

# 📄 Licença

Projeto acadêmico.