// Textos fixos de navegação e critérios de avaliação. Não são dados de equipes:
// tudo que é dado (equipes, notas, avisos, projetos) vem do banco, pela API (pasta /servicos).

// As cinco etapas mostradas na tela inicial
export const atalhos = [
  { to: '/cadastro', titulo: 'Inscrição', detalhe: 'Cadastre sua equipe' },
  { to: '/painel', titulo: 'Painel', detalhe: 'Números das equipes' },
  { to: '/projeto', titulo: 'Projeto', detalhe: 'Envie o repositório' },
  { to: '/avaliacao', titulo: 'Avaliação', detalhe: 'Notas de 0 a 10' },
  { to: '/resultado', titulo: 'Resultado', detalhe: 'Ranking das equipes' },
];

// "campo" é o nome da propriedade no JSON enviado para PUT /equipes/{id}/nota
export const criterios = [
  { id: 'c1', campo: 'inovacao', rotulo: 'Inovação' },
  { id: 'c2', campo: 'execucaoTecnica', rotulo: 'Execução técnica' },
  { id: 'c3', campo: 'apresentacao', rotulo: 'Apresentação' },
];
