// Rota: /login
// Envia e-mail e senha para POST /api/auth/login. Se der certo, o servidor grava o cookie de login
// e a pessoa vai para o perfil. A mensagem de erro é a mesma para e-mail e senha errados.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cartao from '../componentes/Cartao';
import Campo from '../componentes/Campo';
import Label from '../componentes/Label';
import Botao from '../componentes/Botao';
import FluxoDecorativo from '../componentes/FluxoDecorativo';
import { useApp } from '../contexto/AppContext';
import { authServico } from '../servicos/authServico';

export default function TelaDeLogin() {
  const navigate = useNavigate();
  const { definirUsuario } = useApp();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  // Controla se a senha aparece como texto ("Mostrar") ou como bolinhas ("Ocultar")
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function entrar(evento) {
    evento.preventDefault(); // evita recarregar a página ao enviar o formulário
    if (!email.trim() || !senha) {
      setErro('Informe o e-mail e a senha.');
      return;
    }
    setErro('');
    setEnviando(true);
    try {
      const sessao = await authServico.login(email.trim(), senha);
      definirUsuario(sessao);
      navigate('/perfil');
    } catch (e) {
      setErro(e.mensagem);
      setEnviando(false);
    }
  }

  return (
    <div className="login">
      <div className="login-marca">
        <p className="login-lema">Do cadastro ao ranking, em um só fluxo.</p>
        <p>Acompanhe sua equipe, envie o projeto e veja a avaliação do hackathon do IFPR Campus Pinhais.</p>
        <FluxoDecorativo />
      </div>

      <Cartao className="lgn">
        <h1>Entrar no HackFlow</h1>
        <p className="sub" style={{ margin: '0 0 6px' }}>Use o e-mail e a senha do cadastro da sua equipe.</p>

        <form onSubmit={entrar}>
          <Campo id="le" rotulo="E-mail" type="email" placeholder="voce@email.com" autoComplete="username"
            maxLength={120} value={email} onChange={(e) => setEmail(e.target.value)} />

          <Label htmlFor="lp">Senha</Label>
          <div className="pw">
            <input id="lp" type={senhaVisivel ? 'text' : 'password'} autoComplete="current-password"
              maxLength={72} value={senha} onChange={(e) => setSenha(e.target.value)} />
            <button
              type="button"
              onClick={() => setSenhaVisivel(!senhaVisivel)}
              aria-pressed={senhaVisivel}
              aria-label={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {senhaVisivel ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {erro && <div className="err" role="alert">{erro}</div>}

          <Botao type="submit" disabled={enviando} style={{ marginTop: 20 }}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </Botao>
        </form>

        <p className="sub rodape-login">
          Ainda não tem conta? <Link to="/cadastro" className="link-forte">Criar conta</Link>
        </p>
      </Cartao>
    </div>
  );
}
