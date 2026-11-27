# HackFlow (front-end em React)

Reestruturação do `hackflow-prototipo-v2.html` em componentes React, com rotas (React Router) e Vite,
já preparado para conversar com uma REST API.

## Como rodar

```bash
npm install
npm run dev      # abre em http://localhost:5173
```

O front chama `/api/...`. Em desenvolvimento o Vite repassa essas chamadas para `http://127.0.0.1:8080`
(ajuste em `vite.config.js`). Sem o back end no ar, as telas que dependem dele mostram a mensagem de erro
com o botão "Tentar novamente". Veja `.env.example` para mudar o endereço base.

**A API esperada está descrita em `docs/CONTRATO_API.md`.**

## Estrutura de pastas

```
src/
├── main.jsx              Ponto de entrada (React + Router + estado global)
├── App.jsx               Mapa de rotas (URL → tela)
├── telas/                Uma tela por arquivo (cada uma é uma rota)
│   ├── TelaDeLogin.jsx           /login
│   ├── TelaInicial.jsx           /inicio
│   ├── TelaDePainel.jsx          /painel
│   ├── TelaDePerfil.jsx          /perfil
│   ├── TelaDeCadastro.jsx        /cadastro
│   ├── TelaDeDuplicidade.jsx     /cadastro/duplicado
│   ├── TelaDeConfirmacao.jsx     /confirmacao
│   ├── TelaDeProjeto.jsx         /projeto
│   ├── TelaDeAgenda.jsx          /agenda
│   ├── TelaDeAvaliacao.jsx       /avaliacao
│   ├── TelaDeFicha.jsx           /avaliacao/:id
│   ├── TelaDeResultado.jsx       /resultado
│   └── TelaDeRegulamento.jsx     /regulamento
├── servicos/             Comunicação com a API (único lugar que chama fetch)
│   ├── api.js                    fetch padronizado + ErroApi
│   └── equipesServico.js, avisosServico.js, resultadoServico.js, painelServico.js
├── hooks/useCarregar.js  Busca dados ao abrir a tela (carregando / erro / tentar de novo)
├── utils/formatar.js     Datas, horas e iniciais → texto
├── utils/validar.js      Validação de e-mail, celular e links https
├── componentes/          Peças reutilizáveis (Label, Campo, Botao, Cartao, Item, Selo, Alerta,
│                         Avatar, Layout, Navbar, Rodape, Toast, gráficos, FluxoDecorativo,
│                         LimiteDeErro, EstadoDaRequisicao...)
├── contexto/AppContext.jsx   Toast e usuário logado
├── dados/constantes.js       Nomes das etapas e critérios de avaliação (nenhum dado de equipe)
└── estilos.css           Todos os estilos em um só arquivo, separados por comentários (índice no topo)
docs/CONTRATO_API.md      Endpoints, JSON e códigos de status esperados
docs/ANALISE_E_VULNERABILIDADES.md   Análise crítica, vulnerabilidades e pendências
```

## Como uma tela fala com a API

```
Tela  →  servicos/xxxServico.js  →  servicos/api.js  →  fetch("/api/...")
```

- **Ao abrir (GET):** `useCarregar(() => equipesServico.listar())` devolve `{ dados, carregando, erro }`.
- **Ao enviar (POST/PUT):** `try { await servico.metodo(...) } catch (e) { mostrarToast(e.mensagem) }`.
- **Erros:** toda falha vira `ErroApi` com `status`, `mensagem` e `corpo` (ex.: o 409 do cadastro traz a inscrição existente).

## O que ficou a cargo do servidor

Código da equipe (`HF-xxx`), checagem de e-mail duplicado (409), hora do aviso, média da nota,
ordenação do ranking e estatísticas do painel. O front só exibe o resultado.

## Login e perfil (/login, /cadastro, /perfil)

O cadastro pede e-mail e senha e já deixa a pessoa logada; quem se cadastra é o **responsável** da equipe.
O login é um cookie `HttpOnly` gravado pelo servidor: o front só pergunta quem está logado (`GET /auth/sessao`).
O perfil mostra **apenas dados reais** do banco: dados do responsável, equipe, código, projeto, nota e posição.
A seção "Gestão da equipe" aparece quando o servidor informa `papel: RESPONSAVEL`.
Detalhes dos endpoints em `docs/CONTRATO_API.md`.

## Ainda não implementado

Exigir login nas rotas de escrita (projeto, nota, aviso) e papéis de jurado e comissão, recuperação de senha e HTTPS.
Itens com o comentário `SEGURANÇA` no back end (`hackflow-api`).
