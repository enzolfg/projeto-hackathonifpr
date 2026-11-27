// Rota: /inicio
// Só mostra dados reais: avisos e ranking vêm da API (banco) e o cartão do meio vem da sessão.
import { Link } from 'react-router-dom';
import Cartao from '../componentes/Cartao';
import CartaoPerfil from '../componentes/CartaoPerfil';
import EstadoDaRequisicao from '../componentes/EstadoDaRequisicao';
import FluxoDecorativo from '../componentes/FluxoDecorativo';
import Item from '../componentes/Item';
import Selo from '../componentes/Selo';
import useCarregar from '../hooks/useCarregar';
import { useApp } from '../contexto/AppContext';
import { atalhos } from '../dados/constantes';
import { avisosServico } from '../servicos/avisosServico';
import { resultadoServico } from '../servicos/resultadoServico';
import { formatarHora } from '../utils/formatar';

export default function TelaInicial() {
  const { usuario } = useApp();
  const avisos = useCarregar(() => avisosServico.listar());
  const resultado = useCarregar(() => resultadoServico.buscar());

  return (
    <>
      {/* Faixa de destaque com a ilustração do fluxo */}
      <section className="hero">
        <FluxoDecorativo className="hero-fluxo" />
        <h1>1º Hackathon do IFPR Campus Pinhais</h1>
        <p>Inscreva sua equipe, envie o projeto e acompanhe a avaliação e o ranking em um só lugar.</p>
        <span className="chip">IFPR · Campus Pinhais</span>
      </section>

      {/* As cinco etapas, numeradas e ligadas por uma linha (o "fluxo") */}
      <ol className="q" aria-label="Etapas do hackathon">
        {atalhos.map((a) => (
          <li key={a.to}>
            <Link to={a.to}>
              <b>{a.titulo}</b>
              <span>{a.detalhe}</span>
            </Link>
          </li>
        ))}
      </ol>

      {/* Três colunas: avisos, sua equipe e ranking (tudo vindo do banco) */}
      <div className="g3">
        <Cartao>
          <h2>Avisos recentes</h2>
          <EstadoDaRequisicao carregando={avisos.carregando} erro={avisos.erro} aoTentarNovamente={avisos.recarregar} />
          {avisos.dados && avisos.dados.length === 0 && <p className="sub" style={{ margin: 0 }}>Nenhum aviso publicado ainda.</p>}
          {avisos.dados && avisos.dados.slice(0, 3).map((a) => (
            <Item key={a.id} urgente={a.urgente}>
              <div>{a.urgente && <><Selo>Urgente</Selo>{' '}</>}{a.texto}</div>
              <small>{formatarHora(a.criadoEm)}</small>
            </Item>
          ))}
          {avisos.dados && avisos.dados.length > 0 && <Link to="/agenda" className="lk">Ver todos os avisos</Link>}
        </Cartao>

        <CartaoPerfil usuario={usuario} />

        <Cartao>
          <h2>Ranking</h2>
          <EstadoDaRequisicao carregando={resultado.carregando} erro={resultado.erro} aoTentarNovamente={resultado.recarregar} />
          {resultado.dados && resultado.dados.ranking.length === 0 && <p className="sub" style={{ margin: 0 }}>Nenhuma equipe avaliada ainda.</p>}
          {resultado.dados && resultado.dados.ranking.slice(0, 3).map((e) => (
            <Item key={e.id}>
              <span className={'pos' + (e.posicao === 1 ? ' pos-1' : '')}>{e.posicao}</span>
              <div><b>{e.nome}</b></div>
              <b className="nota">{e.nota.toFixed(1)}</b>
            </Item>
          ))}
          {resultado.dados && resultado.dados.ranking.length > 0 && <Link to="/resultado" className="lk">Ver ranking completo</Link>}
        </Cartao>
      </div>
    </>
  );
}
