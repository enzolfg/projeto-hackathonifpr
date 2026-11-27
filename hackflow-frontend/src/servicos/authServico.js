import { api } from './api';

export const authServico = {
  // POST /auth/login { email, senha } -> { nome, equipe, equipeId } (o servidor também grava o cookie de login)
  login: (email, senha) => api.post('/auth/login', { email, senha }),

  // POST /auth/logout -> 204 (o servidor apaga o cookie)
  logout: () => api.post('/auth/logout'),

  // GET /auth/sessao -> { nome, equipe, equipeId } se há login, ou null (204) se não há
  sessao: () => api.get('/auth/sessao'),

  // GET /perfil -> dados reais de quem está logado (401 se não houver login)
  perfil: () => api.get('/perfil'),
};
