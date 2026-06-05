# CRUD FP - FitPlanner

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000?style=for-the-badge&logo=bun&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

Projeto Full Stack utilizando monorepo com Bun, frontend em Next.js e backend em FastAPI.

**FitPlanner** - Sistema de Planejamento Fitness

</div>

---

## 📚 Tecnologias

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS 4
* Biome

### Backend

* FastAPI
* Python 3.11+
* Uvicorn

### Monorepo

* Bun Workspaces
* Concurrently

---

## 🚀 Instalação

### 1. Pré-requisitos

* [Bun](https://bun.sh) (v1.3+)
* [Python 3.11+](https://www.python.org/downloads/)
* [Git](https://git-scm.com)

### 2. Instale o Bun

#### Linux / macOS

```bash
curl -fsSL https://bun.sh/install | bash
```

#### Windows

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

Verifique:

```bash
bun --version
```

### 3. Clone e Instale

```bash
git clone https://github.com/PauloRegisss/crud-fp.git
cd crud-fp
bun run setup
```

> ✅ **Cross-platform!** Todos os comandos funcionam automaticamente em Windows, Linux e macOS.

---

## 🧪 Comandos

| Comando | Descrição |
|---------|-----------|
| `bun run setup` | Instala todas as dependências |
| `bun run dev` | Inicia frontend e backend |
| `bun run start` | Builda e inicia em produção |
| `bun run lint` | Verifica o código |
| `bun run format` | Formata o código |

---

## 🌐 Endereços

| Serviço | URL |
|---------|-----|
| Frontend | [http://localhost:3000](http://localhost:3000) |
| Backend | [http://localhost:8000](http://localhost:8000) |

---

## 📁 Estrutura

```txt
crud-fp/
├── apps/
│   ├── frontend/     # Next.js
│   │   ├── app/
│   │   ├── design.pen
│   │   └── package.json
│   │
│   └── backend/      # FastAPI
│       ├── app/
│       ├── requirements.txt
│       └── .venv/
│
├── scripts/
│   └── activate.mjs  # Helper cross-platform
│
├── package.json
├── bun.lock
└── README.md
```

---

## 🧠 Sobre o Projeto

**FitPlanner** é um sistema de planejamento fitness desenvolvido como projeto acadêmico. O sistema permite:

* **CRUD de Planos de Treino** - Criar, visualizar, editar e excluir treinos
* **Cadastro de Exercícios** - Registrar exercícios com séries, repetições e duração
* **Controle de Metas** - Definir e acompanhar objetivos fitness
* **Acompanhamento de Evolução** - Monitorar progresso ao longo do tempo
* **Sugestões Personalizadas** - Dicas de treinos, alimentação e descanso

### Arquitetura

O projeto utiliza uma arquitetura monorepo moderna com:

* **Bun Workspaces** para gerenciamento de pacotes
* **Next.js 16** com App Router para o frontend
* **FastAPI** para o backend Python
* **Tailwind CSS 4** para estilização
* **Biome** para lint e formatação

---

## 📄 Licença

Este projeto é um trabalho acadêmico.
