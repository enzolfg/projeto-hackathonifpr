# Contrato da API — HackFlow

O que o front espera do back end (implementado em `hackflow-api`). Se algo mudar, ajuste o serviço correspondente
em `src/servicos/` e, se um nome de campo mudar, a tela que o usa.

## Regras gerais

- **Base:** `/api` (configurável por `VITE_API_URL`; em desenvolvimento o Vite repassa `/api` para `http://127.0.0.1:8080`).
- **Formato:** JSON em UTF-8, campos em `camelCase`. **Datas:** ISO-8601 (`"2026-11-23T09:12:00"`).
- **Erros:** todo 4xx/5xx devolve `{ "mensagem": "texto para o usuário" }`.
- **Login:** cookie `hf_sessao` (`HttpOnly`, `SameSite=Strict`) gravado pelo servidor. O front nunca lê nem guarda o token;
  as requisições do mesmo site enviam o cookie sozinhas.

## Endpoints

| Método | Rota | Usado em |
|---|---|---|
| POST | `/equipes` | TelaDeCadastro |
| GET | `/equipes` · `/equipes/{id}` | TelaDeAvaliacao · TelaDeFicha |
| POST | `/equipes/{id}/projeto` | TelaDeProjeto |
| PUT | `/equipes/{id}/nota` | TelaDeFicha |
| GET · POST | `/avisos` | TelaDeAgenda · TelaInicial |
| GET | `/resultado` | TelaDeResultado · TelaInicial |
| GET | `/painel/resumo` | TelaDePainel |
| POST | `/auth/login` · `/auth/logout` | TelaDeLogin · TelaDePerfil |
| GET | `/auth/sessao` | AppContext (ao abrir o site) |
| GET | `/perfil` | TelaDePerfil (exige login) |

### POST /equipes
```json
{ "nome": "Equipe Épsilon", "responsavel": "Maria Alves", "email": "maria@ifpr.edu.br", "senha": "minimo8chars", "celular": "", "integrantes": 4 }
```
- `senha`: 8 a 72 caracteres, diferente do e-mail. O servidor guarda só o hash BCrypt.
- `201` `{ "id": 5, "nome": "Equipe Épsilon", "codigo": "HF-482" }` + `Set-Cookie` (a pessoa já fica logada).
- `409` `{ "mensagem": "Já existe uma inscrição com este e-mail." }`: não devolve dados da outra equipe.
- `400` campo inválido.

### GET /equipes · GET /equipes/{id}
`[{ "id": 1, "nome": "Equipe Alfa", "temProjeto": true, "nota": 8.7 }]` (`nota` é `null` até ser avaliada). `404` se não existir.

### POST /equipes/{id}/projeto
`{ "repositorio": "https://github.com/equipe/projeto", "descricao": "..." }` → `201`. `400` se o link não for `https://`; `404`.

### PUT /equipes/{id}/nota
`{ "inovacao": 8, "execucaoTecnica": 7.5, "apresentacao": 9 }` (0 a 10) → `200 { "id": 2, "nota": 8.2 }` (média calculada
pelo servidor). `400` fora do intervalo; `404`; `409` se a equipe não enviou projeto.

### GET /avisos · POST /avisos
`[{ "id": 2, "texto": "...", "urgente": true, "criadoEm": "2026-11-23T10:05:00" }]` (mais recentes primeiro).
`POST { "texto": "...", "urgente": true }` → `201` com o aviso (o servidor define `id` e `criadoEm`).

### GET /resultado
`{ "ranking": [{ "posicao": 1, "id": 1, "nome": "Equipe Alfa", "nota": 8.7 }], "aguardando": [{ "id": 2, "nome": "Equipe Beta" }] }`

### GET /painel/resumo (tudo calculado no banco)
```json
{
  "atualizadoEm": "2026-11-23T09:12:00",
  "equipes": 4, "projetosEnviados": 3, "equipesAvaliadas": 2, "aguardandoAvaliacao": 1,
  "notasPorEquipe": [ { "nome": "Equipe Alfa", "valor": 8.7 } ],
  "situacao": { "avaliadas": 2, "aguardando": 1, "semProjeto": 1 },
  "inscricoesPorDia": [ { "dia": "21/11", "total": 2 } ]
}
```

### POST /auth/login · POST /auth/logout · GET /auth/sessao
- `POST /auth/login { "email", "senha" }` → `200 { "nome": "Maria Alves", "equipe": "Equipe Épsilon", "equipeId": 5 }` + cookie.
  `401 "E-mail ou senha incorretos."` (mesma mensagem nos dois casos) · `429` após 5 falhas em 15 minutos.
- `POST /auth/logout` → `204` e apaga o cookie.
- `GET /auth/sessao` → `200` com o mesmo corpo do login, ou `204` se ninguém está logado.

### GET /perfil (exige login; `401` sem sessão)
```json
{
  "nome": "Maria Alves", "email": "maria@ifpr.edu.br", "celularMascarado": "(41) •••••-0000",
  "papel": "RESPONSAVEL", "inscritoEm": "2026-11-23T20:00:00",
  "equipe": { "id": 5, "nome": "Equipe Épsilon", "codigo": "HF-482", "integrantes": 4 },
  "projeto": { "repositorio": "https://github.com/equipe/projeto", "descricao": "...", "enviadoEm": "2026-11-23T21:10:00" },
  "desempenho": { "nota": 8.7, "posicao": 1, "totalAvaliadas": 2 }
}
```
- `projeto` é `null` sem projeto enviado. `nota` e `posicao` são `null` sem avaliação.
- O id vem da **sessão**, nunca da URL. `papel` hoje é sempre `RESPONSAVEL` (só o responsável tem conta).

## Próxima etapa de segurança
Exigir login e conferir a equipe em `POST /equipes/{id}/projeto`; papéis de jurado (nota) e comissão (aviso);
CSRF ao proteger rotas de escrita; recuperação de senha; HTTPS (`hackflow.cookie.seguro=true`).
