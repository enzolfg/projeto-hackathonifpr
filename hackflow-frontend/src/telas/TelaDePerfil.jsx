// Rota: /perfil
// Mostra SÓ dados reais, vindos de GET /api/perfil (quem está logado). Sem login o servidor responde 401
// e a tela leva para /login. Layout: coluna lateral (dados e código da equipe) e conteúdo ao lado.
// Quem é o responsável é decidido pelo servidor (campo "papel"); esconder a gestão aqui é só
// comodidade de uso, a proteção de verdade precisa estar no servidor.
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../componentes/Avatar';
import Botao from '../componentes/Botao';
import Cartao from '../componentes/Cartao';
import EstadoDaRequisicao from '../componentes/EstadoDaRequisicao';
import Item from '../componentes/Item';
import Selo from '../componentes/Selo';
import useCarregar from '../hooks/useCarregar';
import { useApp } from '../contexto/AppContext';
import { authServico } from '../servicos/authServico';
import { formatarDataHora, iniciaisDe } from '../utils/formatar';
import { validarUrlHttps } from '../utils/validar';

export default function TelaDePerfil() {
  const navigate = useNavigate();
  const { mostrarToast, definirUsuario } = useApp();
  const { dados: perfil, carregando, erro, recarregar } = useCarregar(() => authServico.perfil());

  // Sem login (ou sessão vencida): limpa o usuário e volta para o login.
  useEffect(() => {
    if (erro?.status === 401) {
      definirUsuario(null);
      navigate('/login', { replace: true });
    }
  }, [erro, definirUsuario, navigate]);

  async function sair() {
    try {
      await authServico.logout();
      definirUsuario(null);
      mostrarToast('Sessão encerrada.');
      navigate('/login');
    } catch (e) {
      mostrarToast(e.mensagem);
    }
  }

  if (erro?.status === 401) return null;
  if (carregando || erro) {
    return (
      <Cartao className="fm">
        <EstadoDaRequisicao carregando={carregando} erro={erro} aoTentarNovamente={recarregar} />
      </Cartao>
    );
  }

  const { equipe, projeto, desempenho } = perfil;
  const ehResponsavel = perfil.papel === 'RESPONSAVEL';
  const avaliada = desempenho.nota !== null;
  // Só vira link se for https (bloqueia javascript: e outros esquemas perigosos)
  const repositorioSeguro = projeto && validarUrlHttps(projeto.repositorio);

  return (
    <div className="perfil">
      {/* ---------- Coluna lateral ---------- */}
      <aside className="perfil-lateral" aria-label="Dados da conta">
        <Cartao>
          <Avatar iniciais={iniciaisDe(perfil.nome)} tamanho="g" />
          <h1>{perfil.nome}</h1>
          <Selo ok={ehResponsavel} tom={ehResponsavel ? undefined : 'neutro'}>
            {ehResponsavel ? 'Responsável da equipe' : 'Integrante'}
          </Selo>

          <dl className="dados">
            <div><dt>E-mail</dt><dd>{perfil.email}</dd></div>
            {perfil.celularMascarado && <div><dt>Celular</dt><dd>{perfil.celularMascarado}</dd></div>}
            <div><dt>Equipe</dt><dd>{equipe.nome}</dd></div>
            <div><dt>Inscrição feita em</dt><dd>{formatarDataHora(perfil.inscritoEm)}</dd></div>
          </dl>
        </Cartao>

        <Cartao className="credencial">
          <h2>Código da equipe</h2>
          <p className="codigo">{equipe.codigo}</p>
          <small>Identifica a sua equipe no HackFlow.</small>
        </Cartao>

        <Botao variante="alt" onClick={sair} style={{ marginTop: 0 }}>Sair da conta</Botao>
      </aside>

      {/* ---------- Conteúdo ---------- */}
      <div className="perfil-conteudo">
        <div className="faixa tres">
          <Cartao className="kpi kpi-pontos">
            <b>{avaliada ? desempenho.nota.toFixed(1) : '—'}</b>
            <small>{avaliada ? 'nota final da equipe' : 'aguardando avaliação'}</small>
          </Cartao>
          <Cartao className="kpi">
            <b>{desempenho.posicao ? `${desempenho.posicao}º` : '—'}</b>
            <small>{desempenho.posicao ? `entre ${desempenho.totalAvaliadas} equipes avaliadas` : 'sem posição ainda'}</small>
          </Cartao>
          <Cartao className="kpi">
            <b>{equipe.integrantes}</b>
            <small>integrantes informados</small>
          </Cartao>
        </div>

        <Cartao>
          <div className="secao-topo">
            <h2>Equipe {equipe.nome}</h2>
            <small>{equipe.integrantes} integrantes</small>
          </div>
          <Item>
            <Avatar iniciais={iniciaisDe(perfil.nome)} />
            <div>
              <b>{perfil.nome} (você)</b>
              <small>Responsável pela equipe</small>
            </div>
            {ehResponsavel && <Selo ok>Responsável</Selo>}
          </Item>
          <small style={{ marginTop: 10 }}>
            O cadastro informou {equipe.integrantes} integrantes, mas por enquanto só o responsável tem conta no sistema.
          </small>
        </Cartao>

        <Cartao>
          <div className="secao-topo">
            <h2>Projeto</h2>
            <Selo ok={Boolean(projeto)}>{projeto ? 'Enviado' : 'Pendente'}</Selo>
          </div>
          {projeto ? (
            <dl className="dados sem-topo">
              <div>
                <dt>Repositório</dt>
                <dd>
                  {repositorioSeguro ? (
                    <a href={projeto.repositorio} target="_blank" rel="noopener noreferrer">
                      {projeto.repositorio.replace(/^https:\/\//, '')}
                    </a>
                  ) : (
                    projeto.repositorio
                  )}
                </dd>
              </div>
              {projeto.descricao && <div><dt>Descrição</dt><dd>{projeto.descricao}</dd></div>}
              <div><dt>Enviado em</dt><dd>{formatarDataHora(projeto.enviadoEm)}</dd></div>
            </dl>
          ) : (
            <p className="sub" style={{ margin: 0 }}>Nenhum projeto enviado ainda.</p>
          )}
        </Cartao>

        {/* Seção separada: aparece só para o responsável */}
        {ehResponsavel && (
          <Cartao className="gestao">
            <div className="secao-topo">
              <h2>Gestão da equipe</h2>
              <Selo ok>Somente responsável</Selo>
            </div>
            <p className="sub" style={{ margin: '0 0 14px' }}>Ações disponíveis para você, como responsável.</p>
            <div className="acoes">
              <Link to="/projeto" className="acao">
                <b>{projeto ? 'Atualizar projeto' : 'Enviar projeto'}</b>
                <small>Repositório e descrição</small>
              </Link>
            </div>
          </Cartao>
        )}
      </div>
    </div>
  );
}
