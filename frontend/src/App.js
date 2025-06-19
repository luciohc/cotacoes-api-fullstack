import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [cotacoes, setCotacoes] = useState([]);
  const [novaMoeda, setNovaMoeda] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [historico, setHistorico] = useState([]);

  const carregarCotacoes = () => {
    $.get('https://cotacoes-api-fullstack.onrender.com/api/cotacoes', (data) => {
      setCotacoes(data);
    });
  };

  const adicionarCotacao = () => {
    $.ajax({
      url: 'https://cotacoes-api-fullstack.onrender.com/api/cotacoes',
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
            $.get('https://cotacoes-api-fullstack.onrender.com/api/cotacoes/external/bcb', () => {
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
            $.get('https://cotacoes-api-fullstack.onrender.com/api/cotacoes/external/openex', () => {
              alert('Cotações do Open Exchange Rates salvas!');
              carregarCotacoes();
            }).fail(() => alert('Erro ao buscar cotação do OpenEx'));
          }}
        >
          Buscar cotações do Open Exchange Rates
        </button>

        <button
         
          className="btn btn-info"
          onClick={() => {
            const moeda = prompt('Digite a moeda (ex: USD, EUR):');
            const startDate = prompt('Digite a data inicial (YYYY-MM-DD) ou deixe vazio:');
            const endDate = prompt('Digite a data final (YYYY-MM-DD) ou deixe vazio:');
            const minValor = prompt('Digite o valor mínimo ou deixe vazio:');
            const maxValor = prompt('Digite o valor máximo ou deixe vazio:');
            const page = prompt('Digite o número da página (ex: 1, 2, 3):', 1);
            const limit = prompt('Digite o número de registros por página:', 5);

            let url = `https://cotacoes-api-fullstack.onrender.com/api/cotacoes/historico/${moeda}?page=${page}&limit=${limit}`;

            if (startDate && endDate) url += `&startDate=${startDate}&endDate=${endDate}`;
            if (minValor && maxValor) url += `&minValor=${minValor}&maxValor=${maxValor}`;

            $.get(url, (data) => {
              let historicoHtml = "<h3 style='color: blue;'>Histórico de Cotações</h3><table class='table table-striped'><tr><th>ID</th><th>Moeda</th><th>Valor</th><th>Data</th></tr>";
              data.forEach(cotacao => {
                historicoHtml += `<tr>
            <td>${cotacao.id}</td>
            <td>${cotacao.moeda}</td>
            <td>${cotacao.valor}</td>
            <td>${new Date(cotacao.data_insercao).toLocaleString()}</td>
          </tr>`;
              });
              historicoHtml += "</table>";
              document.getElementById("historicoCotacoes").innerHTML = historicoHtml;
            }).fail(() => alert('Erro ao buscar o histórico.'));
          }}
        >
          Buscar Histórico de Cotações (com filtros)
        </button>

    </div>

      {/* Tabela de cotações */ }
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

      <div id="historicoCotacoes" className="mt-2"></div>
    </div >
  );
}

export default App;
