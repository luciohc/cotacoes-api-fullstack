import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [cotacoes, setCotacoes] = useState([]);
  const [novaMoeda, setNovaMoeda] = useState('');
  const [novoValor, setNovoValor] = useState('');

  const carregarCotacoes = () => {
    $.get('https://SEU_BACKEND_RENDER.onrender.com/api/cotacoes', (data) => {
      setCotacoes(data);
    });
  };

  const adicionarCotacao = () => {
    $.ajax({
      url: 'https://SEU_BACKEND_RENDER.onrender.com/api/cotacoes',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ moeda: novaMoeda, valor: novoValor }),
      success: () => {
        setNovaMoeda('');
        setNovoValor('');
        carregarCotacoes();
      },
    });
  };

  useEffect(() => {
    carregarCotacoes();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-primary">Cadastro de Cotações de Moedas</h2>

      {/* Formulário para adicionar nova cotação */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Moeda (Ex: USD)"
          value={novaMoeda}
          onChange={(e) => setNovaMoeda(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Valor"
          value={novoValor}
          onChange={(e) => setNovoValor(e.target.value)}
        />
        <button className="btn btn-success" onClick={adicionarCotacao}>Adicionar Cotação</button>
      </div>

      {/* Botões para buscar de fontes externas */}
      <div className="mb-3">
        <button
          className="btn btn-info me-2"
          onClick={() => {
            $.get('https://SEU_BACKEND_RENDER.onrender.com/api/cotacoes/external/bcb', () => {
              alert('Cotações do Banco Central salvas!');
              carregarCotacoes();
            }).fail(() => alert('Erro ao buscar cotação do BCB'));
          }}
        >
          Buscar cotações do Banco Central (BCB)
        </button>

        <button
          className="btn btn-warning"
          onClick={() => {
            $.get('https://SEU_BACKEND_RENDER.onrender.com/api/cotacoes/external/openex', () => {
              alert('Cotações do Open Exchange Rates salvas!');
              carregarCotacoes();
            }).fail(() => alert('Erro ao buscar cotação do OpenEx'));
          }}
        >
          Buscar cotações do Open Exchange Rates
        </button>
      </div>

      {/* Tabela de cotações */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Moeda</th>
            <th>Valor</th>
            <th>Data Inserção</th>
          </tr>
        </thead>
        <tbody>
          {cotacoes.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.moeda}</td>
              <td>{c.valor}</td>
              <td>{new Date(c.data_insercao).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
