// Cartão da tela inicial. Logado: nome e equipe reais, com atalho para o perfil.
// Sem login: convida a cadastrar a equipe ou entrar. Não mostra nenhum número inventado.
import { Link, useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import Botao from './Botao';
import Cartao from './Cartao';
import { iniciaisDe } from '../utils/formatar';

export default function CartaoPerfil({ usuario }) {
  const navigate = useNavigate();

  if (!usuario) {
    return (
      <Cartao className="pf">
        <h2>Sua equipe</h2>
        <p className="sub" style={{ margin: '0 0 6px' }}>Cadastre a equipe ou entre para ver o seu perfil.</p>
        <Botao onClick={() => navigate('/cadastro')}>Cadastrar equipe</Botao>
        <Botao variante="alt" onClick={() => navigate('/login')}>Entrar</Botao>
      </Cartao>
    );
  }

  return (
    <Cartao className="pf">
      <Avatar iniciais={iniciaisDe(usuario.nome)} tamanho="g" />
      <b>{usuario.nome}</b>
      <small>{usuario.equipe}</small>
      <Link to="/perfil" className="lk">Ver meu perfil</Link>
    </Cartao>
  );
}
