import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [cotacoes, setCotacoes] = useState([]);
  const [novaMoeda, setNovaMoeda] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [filtroMoeda, setFiltroMoeda] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [filtroMinValor, setFiltroMinValor] = useState('');
  const [filtroMaxValor, setFiltroMaxValor] = useState('');
  const [filtroPage, setFiltroPage] = useState(1);
  const [filtroLimit, setFiltroLimit] = useState(5);

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

  const buscarHistorico = () => {
    // Validação de campos obrigatórios
    if (!filtroMoeda.trim()) {
      alert('Por favor, informe a moeda.');
      return;
    }
    if (!filtroDataInicio.trim() || !filtroDataFim.trim()) {
      alert('Por favor, informe a data de início e a data de fim.');
      return;
    }
    if (!filtroPage || isNaN(filtroPage)) {
      alert('Por favor, informe um número válido para a página.');
      return;
    }
    if (!filtroLimit || isNaN(filtroLimit)) {
      alert('Por favor, informe um número válido para o limite.');
      return;
    }

    const dataInicioFormatada = filtroDataInicio;
    const dataFimFormatada = filtroDataFim;

    let url = `https://cotacoes-api-fullstack.onrender.com/api/cotacoes/historico/${filtroMoeda}?page=${filtroPage}&limit=${filtroLimit}`;
    if (filtroDataInicio && filtroDataFim) url += `&startDate=${dataInicioFormatada}&endDate=${dataFimFormatada}`;
    if (filtroMinValor !== '') url += `&minValor=${filtroMinValor}`;
    if (filtroMaxValor !== '') url += `&maxValor=${filtroMaxValor}`;

    // Limpa a div antes de exibir o novo resultado
    document.getElementById("historicoCotacoes").innerHTML = '';

    $.get(url, (data) => {
      let historicoHtml = "<h3 style='color: blue;'>Histórico de Cotações</h3>";

      if (data.length === 0) {
        historicoHtml += "<div class='alert alert-warning'>Nenhum resultado encontrado para os filtros informados.</div>";
      } else {
        historicoHtml += "<table class='table table-striped'><tr><th>ID</th><th>Moeda</th><th>Valor</th><th>Data</th></tr>";
        data.forEach(cotacao => {
          historicoHtml += `<tr>
            <td>${cotacao.id}</td>
            <td>${cotacao.moeda}</td>
            <td>${cotacao.valor}</td>
            <td>${new Date(cotacao.data_insercao).toLocaleString()}</td>
          </tr>`;
        });
        historicoHtml += "</table>";
      }

      document.getElementById("historicoCotacoes").innerHTML = historicoHtml;
    }).fail((xhr) => {
      alert(`Erro ao buscar o histórico: ${xhr.responseText || 'Erro desconhecido'}`);
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary">Cadastro de Cotações de Moedas</h2>

      {/* Formulário de nova cotação */}
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

      {/* Botões de fontes externas */}
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
      </div>

      {/* Filtros */}
      <div className="mb-3">
        <h4 className="text-primary">Filtros de Busca do Histórico</h4>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Moeda (ex: USD, EUR)"
          value={filtroMoeda}
          onChange={(e) => setFiltroMoeda(e.target.value)}
        />
        <input
          type="date"
          className="form-control mb-2"
          value={filtroDataInicio}
          onChange={(e) => setFiltroDataInicio(e.target.value)}
        />
        <input
          type="date"
          className="form-control mb-2"
          value={filtroDataFim}
          onChange={(e) => setFiltroDataFim(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Valor Mínimo"
          value={filtroMinValor}
          onChange={(e) => setFiltroMinValor(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Valor Máximo"
          value={filtroMaxValor}
          onChange={(e) => setFiltroMaxValor(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Página"
          value={filtroPage}
          onChange={(e) => setFiltroPage(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Limite por Página"
          value={filtroLimit}
          onChange={(e) => setFiltroLimit(e.target.value)}
        />

        <button className="btn btn-info" onClick={buscarHistorico}>
          Buscar Histórico de Cotações (com filtros)
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

      <div id="historicoCotacoes" className="mt-2"></div>
    </div>
  );
}

export default App;
