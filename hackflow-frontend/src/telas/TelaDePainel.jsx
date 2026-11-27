// Rota: /painel  (GET /painel/resumo)
// Todos os números e gráficos vêm de consultas ao banco, feitas pelo servidor.
import Cartao from '../componentes/Cartao';
import GraficoBarras from '../componentes/GraficoBarras';
import GraficoRosca from '../componentes/GraficoRosca';
import GraficoLinha from '../componentes/GraficoLinha';
import EstadoDaRequisicao from '../componentes/EstadoDaRequisicao';
import useCarregar from '../hooks/useCarregar';
import { painelServico } from '../servicos/painelServico';
import { formatarDataHora } from '../utils/formatar';

export default function TelaDePainel() {
  const { dados, carregando, erro, recarregar } = useCarregar(() => painelServico.resumo());

  const kpis = dados && [
    { valor: dados.equipes, rotulo: 'Equipes inscritas' },
    { valor: dados.projetosEnviados, rotulo: 'Projetos enviados' },
    { valor: dados.equipesAvaliadas, rotulo: 'Equipes avaliadas' },
    { valor: dados.aguardandoAvaliacao, rotulo: 'Aguardando avaliação' },
  ];

  return (
    <>
      <h1>Painel das equipes</h1>
      <p className="sub" style={{ margin: 0 }}>
        {dados ? `Atualizado em ${formatarDataHora(dados.atualizadoEm)}.` : ' '}
      </p>

      <EstadoDaRequisicao carregando={carregando} erro={erro} aoTentarNovamente={recarregar} />

      {dados && (
        <>
          {/* Quatro números de destaque */}
          <div className="faixa">
            {kpis.map((k) => (
              <Cartao key={k.rotulo} className="kpi">
                <b>{k.valor}</b>
                <small>{k.rotulo}</small>
              </Cartao>
            ))}
          </div>

          <div className="cg">
            <Cartao>
              <h2>Nota final por equipe</h2>
              <GraficoBarras dados={dados.notasPorEquipe} vazio="Nenhuma equipe avaliada ainda." />
            </Cartao>

            <div className="rc">
              <Cartao>
                <h2>Situação das equipes</h2>
                <GraficoRosca situacao={dados.situacao} />
              </Cartao>
              <Cartao>
                <h2>Inscrições por dia</h2>
                <GraficoLinha dados={dados.inscricoesPorDia} />
              </Cartao>
            </div>
          </div>
        </>
      )}
    </>
  );
}
