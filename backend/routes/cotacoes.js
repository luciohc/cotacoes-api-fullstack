const express = require('express');
const router = express.Router();
const pool = require('../db');
const axios = require('axios');

// Create
router.post('/', async (req, res) => {
  const { moeda, valor } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cotacoes (moeda, valor) VALUES ($1, $2) RETURNING *',
      [moeda, valor]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read All
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cotacoes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cotacoes WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  const { moeda, valor } = req.body;
  try {
    const result = await pool.query(
      'UPDATE cotacoes SET moeda=$1, valor=$2 WHERE id=$3 RETURNING *',
      [moeda, valor, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Histórico de cotações
router.get('/historico/:moeda', async (req, res) => {
  const { moeda } = req.params;
  const { startDate, endDate } = req.query;

  try {
    let query = 'SELECT * FROM cotacoes WHERE moeda = $1';
    const params = [moeda];

    if (startDate && endDate) {
      query += ' AND data_insercao BETWEEN $2 AND $3';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY data_insercao DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar histórico de cotações:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico de cotações' });
  }
});


// Delete
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM cotacoes WHERE id=$1', [req.params.id]);
    res.json({ message: 'Cotação deletada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para buscar cotação do Dólar no Banco Central do Brasil (SGS)
router.get('/external/bcb', async (req, res) => {
  try {
    const response = await axios.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json');
    const cotacao = response.data[0];
    const moeda = 'USD';
    const valor = parseFloat(cotacao.valor.replace(',', '.')); // Corrige vírgula para ponto

    await pool.query('INSERT INTO cotacoes (moeda, valor) VALUES ($1, $2)', [moeda, valor]);

    res.json({ mensagem: 'Cotação do Banco Central salva com sucesso!', data: cotacao });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar cotação do Banco Central' });
  }
});

router.get('/external/openex', async (req, res) => {
  try {
    const appId = process.env.OPENEX_APP_ID;
    const response = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${appId}&symbols=USD,EUR,BRL`);
    const rates = response.data.rates;

    for (const moeda in rates) {
      const valor = rates[moeda];
      await pool.query('INSERT INTO cotacoes (moeda, valor) VALUES ($1, $2)', [moeda, valor]);
    }

    res.json({ mensagem: 'Cotações OpenEx salvas com sucesso', data: rates });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});


module.exports = router;
