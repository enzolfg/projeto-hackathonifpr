// Rota: /cadastro
// Valida os campos e envia para POST /api/equipes. O servidor guarda só o hash da senha e já
// deixa a pessoa logada (cookie). As validações daqui dão resposta rápida, mas o servidor TAMBÉM valida.
//  - 201: atualiza o usuário logado e vai para /confirmacao;
//  - 409: e-mail já inscrito, vai para /cadastro/duplicado;
//  - outro erro: mostra a mensagem no toast.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cartao from '../componentes/Cartao';
import Campo from '../componentes/Campo';
import Botao from '../componentes/Botao';
import { useApp } from '../contexto/AppContext';
import { equipesServico } from '../servicos/equipesServico';
import { validarCelular, validarEmail } from '../utils/validar';

export default function TelaDeCadastro() {
  const navigate = useNavigate();
  const { mostrarToast, atualizarSessao } = useApp();
  // Um único objeto guarda todos os campos; o "name" de cada input é a chave.
  const [form, setForm] = useState({ nome: '', resp: '', email: '', senha: '', confirmar: '', cel: '', qtd: '3' });
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  function atualizar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }

  // Devolve a mensagem do primeiro problema encontrado ou "" se estiver tudo certo.
  function validar({ nome, resp, email, cel }) {
    if (nome.length < 3 || nome.length > 60) return 'Informe o nome da equipe (3 a 60 caracteres).';
    if (resp.length < 3) return 'Informe o nome do responsável.';
    if (!validarEmail(email)) return 'Informe um e-mail válido.';
    if (form.senha.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
    if (new TextEncoder().encode(form.senha).length > 72) return 'A senha deve ter de 8 a 72 caracteres.';
    if (form.senha.toLowerCase() === email) return 'A senha não pode ser igual ao e-mail.';
    if (form.senha !== form.confirmar) return 'As senhas não conferem.';
    if (cel && !validarCelular(cel)) return 'Celular inválido. Use DDD + número.';
    return '';
  }

  async function cadastrar() {
    const dados = {
      nome: form.nome.trim(),
      resp: form.resp.trim(),
      email: form.email.trim().toLowerCase(),
      cel: form.cel.trim(),
    };
    const problema = validar(dados);
    setErro(problema);
    if (problema) return;

    setEnviando(true);
    try {
      const equipe = await equipesServico.cadastrar({
        nome: dados.nome,
        responsavel: dados.resp,
        email: dados.email,
        senha: form.senha,
        celular: dados.cel,
        integrantes: Number(form.qtd),
      });
      await atualizarSessao(); // o servidor já deixou a pessoa logada: busca quem é
      navigate('/confirmacao', { state: { nome: equipe.nome, codigo: equipe.codigo } });
    } catch (e) {
      if (e.status === 409) {
        navigate('/cadastro/duplicado');
      } else {
        mostrarToast(e.mensagem);
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Cartao className="fm">
      <h1>Cadastro de equipe</h1>
      <p className="sub" style={{ margin: 0 }}>Uma inscrição por equipe. Quem se cadastra é o responsável pela equipe.</p>

      <Campo id="nome" name="nome" rotulo="Nome da equipe" placeholder="Ex.: Equipe Épsilon" maxLength={60} autoComplete="off" value={form.nome} onChange={atualizar} />
      <Campo id="resp" name="resp" rotulo="Nome do responsável" maxLength={80} autoComplete="name" value={form.resp} onChange={atualizar} />
      <Campo id="email" name="email" rotulo="E-mail do responsável" type="email" placeholder="nome@ifpr.edu.br" maxLength={120} autoComplete="email" value={form.email} onChange={atualizar} />
      <Campo id="senha" name="senha" rotulo="Senha" type="password" maxLength={72} autoComplete="new-password" value={form.senha} onChange={atualizar} />
      <small style={{ marginTop: 6 }}>Mínimo de 8 caracteres. Você vai usá-la para entrar no seu perfil.</small>
      <Campo id="confirmar" name="confirmar" rotulo="Confirmar senha" type="password" maxLength={72} autoComplete="new-password" value={form.confirmar} onChange={atualizar} />
      <Campo id="cel" name="cel" rotulo="Celular (opcional)" type="tel" inputMode="tel" maxLength={20} autoComplete="tel" value={form.cel} onChange={atualizar} />
      <Campo id="qtd" name="qtd" rotulo="Número de integrantes" as="select" value={form.qtd} onChange={atualizar}>
        <option>3</option>
        <option>4</option>
        <option>5</option>
      </Campo>

      {erro && <div className="err" role="alert">{erro}</div>}

      <Botao onClick={cadastrar} disabled={enviando}>
        {enviando ? 'Enviando…' : 'Cadastrar equipe'}
      </Botao>
    </Cartao>
  );
}
