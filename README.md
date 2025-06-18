
# 📊 API Cotação de Moedas – Fullstack (Node.js + React + PostgreSQL)

Projeto Fullstack com **Node.js + Express (Backend)**, **React + Bootstrap + JQuery (Frontend)** e **PostgreSQL (Banco de Dados)**.

---

## 📌 Tecnologias Utilizadas

- Node.js + Express
- React.js
- JQuery + Ajax
- Bootstrap
- PostgreSQL
- Render (Deploy)
- RapidAPI (Publicação da API)

---

## 📍 Estrutura do Projeto

```
cotacoes-api-fullstack/
├── backend/
└── frontend/
```

---

## ✅ Como Rodar Localmente

### Backend:

1. Navegue até a pasta `backend/`
2. Crie um arquivo `.env` com:

```
DATABASE_URL=postgresql://SEU_USUARIO:SUA_SENHA@SEU_HOST:PORTA/SEU_BANCO
OPENEX_APP_ID=SUA_API_KEY_OPENEX
PORT=5000
```

3. Instale as dependências:

```bash
npm install
```

4. Rode o servidor:

```bash
node server.js
```

---

### Frontend:

1. Navegue até `frontend/`
2. Instale as dependências:

```bash
npm install
```

3. Rode local:

```bash
npm start
```

Ou, para produção:

```bash
npm run build
```

---

## ✅ Deploy no Render

### Backend:

- Crie um **Web Service** no Render
- Build command: `npm install`
- Start command: `node server.js`
- Variáveis de ambiente: **DATABASE_URL**, **OPENEX_APP_ID**

### Frontend:

- Faça build local:

```bash
npm run build
```

- Crie um **Static Site** no Render
- Public Directory: `frontend/build/`

---

## ✅ Principais Endpoints da API

| Método | Rota | Função |
|---|---|---|
| GET | `/api/cotacoes` | Listar todas as cotações |
| POST | `/api/cotacoes` | Inserir nova cotação |
| GET | `/api/cotacoes/:id` | Buscar cotação por ID |
| PUT | `/api/cotacoes/:id` | Atualizar cotação |
| DELETE | `/api/cotacoes/:id` | Deletar cotação |
| GET | `/api/cotacoes/external/bcb` | Buscar cotação do Banco Central |
| GET | `/api/cotacoes/external/openex` | Buscar cotação do Open Exchange Rates |

---

## ✅ Publicação no RapidAPI

1. Vá para [https://rapidapi.com/](https://rapidapi.com/)
2. Crie uma nova API
3. Configure o **base URL** para o endpoint do seu Render
4. Adicione os endpoints
5. Publique

---

## ✅ Contato

**Autor:** Lúcio Costa  
GitHub: [https://github.com/luciohc](https://github.com/luciohc)
