// Rota: /projeto
// Envia para POST /equipes/{id}/projeto. O id é o da equipe de quem está logado (usuario.equipeId).
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cartao from '../componentes/Cartao';
import Campo from '../componentes/Campo';
import Botao from '../componentes/Botao';
import Alerta from '../componentes/Alerta';
import { useApp } from '../contexto/AppContext';
import { equipesServico } from '../servicos/equipesServico';
import { validarUrlHttps } from '../utils/validar';

export default function TelaDeProjeto() {
  const navigate = useNavigate();
  const { usuario, mostrarToast } = useApp();
  const [repo, setRepo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Sem login, não há equipe à qual associar o projeto.
  if (!usuario) {
    return (
      <Cartao className="fm">
        <h1>Envio do projeto</h1>
        <Alerta>Entre na sua conta para enviar o projeto da equipe.</Alerta>
        <Botao onClick={() => navigate('/login')}>Entrar</Botao>
      </Cartao>
    );
  }

  async function enviar() {
    const link = repo.trim();
    // Só aceita https://: bloqueia javascript: e outros esquemas que seriam perigosos se o link fosse exibido depois.
    if (!validarUrlHttps(link)) { mostrarToast('Informe um link https:// válido para o repositório.'); return; }
    setEnviando(true);
    try {
      await equipesServico.enviarProjeto(usuario.equipeId, {
        repositorio: link,
        descricao: descricao.trim(),
      });
      mostrarToast('Projeto enviado.');
      navigate('/perfil');
    } catch (e) {
      mostrarToast(e.mensagem);
      setEnviando(false);
    }
  }

  return (
    <Cartao className="fm">
      <h1>Envio do projeto</h1>
      <p className="sub" style={{ margin: 0 }}>{usuario.equipe}</p>
      <Campo id="repo" rotulo="Link do repositório" placeholder="https://github.com/equipe/projeto" maxLength={300} inputMode="url" autoComplete="off" value={repo} onChange={(e) => setRepo(e.target.value)} />
      <Campo id="desc" rotulo="Descrição curta" as="textarea" rows="3" placeholder="O que o projeto resolve?" maxLength={500} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      <Botao onClick={enviar} disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar projeto'}</Botao>
    </Cartao>
  );
}
