// Estado compartilhado entre telas. Equipes, avisos, ranking e perfil vivem no servidor (pasta /servicos).
// Aqui ficam só duas coisas do próprio front:
//  - o toast (mensagem rápida);
//  - o "usuario" logado ({ nome, equipe, equipeId } ou null), que espelha a sessão do servidor.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { authServico } from '../servicos/authServico';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [mensagemToast, setMensagemToast] = useState('');
  const temporizador = useRef(null);
  const [usuario, definirUsuario] = useState(null);

  const mostrarToast = useCallback((mensagem) => {
    clearTimeout(temporizador.current);
    setMensagemToast(mensagem);
    temporizador.current = setTimeout(() => setMensagemToast(''), 2400);
  }, []);

  // Pergunta ao servidor quem está logado (o login fica num cookie que o JavaScript não enxerga).
  const atualizarSessao = useCallback(async () => {
    try {
      definirUsuario((await authServico.sessao()) ?? null);
    } catch {
      definirUsuario(null);
    }
  }, []);

  // Ao abrir o site (ou recarregar a página), restaura o usuário se a sessão ainda for válida.
  useEffect(() => {
    atualizarSessao();
  }, [atualizarSessao]);

  const valor = useMemo(
    () => ({ mensagemToast, mostrarToast, usuario, definirUsuario, atualizarSessao }),
    [mensagemToast, mostrarToast, usuario, atualizarSessao]
  );
  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
