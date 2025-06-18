require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');
const cotacoesRouter = require('./routes/cotacoes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/cotacoes', cotacoesRouter);

app.get('/', (req, res) => {
  res.send('API Cotação de Moedas rodando!');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
