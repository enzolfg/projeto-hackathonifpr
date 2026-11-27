<h1 align="center">🚀 HackFlow</h1>

<p align="center">Sistema de apoio à organização do 1º Hackathon do IFPR Campus Pinhais</p>

![Java 21](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)

Plataforma para apoiar o hackathon: inscrição de equipes, submissão de projetos,
avaliação por jurados, placar público e central de avisos.

**Versão atual:** 0.1.0. Histórico em [CHANGELOG.md](CHANGELOG.md).

**Protótipo:** [Figma](Lhttps://www.figma.com/proto/QS1GKDNAEhnb1yGT2AE05r/HackFlow-%E2%80%93-IFPR-Campus-Pinhais?node-id=1-2&p=f&t=KCOmZhu1FK5gHDVr-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1)

## Sumário
- [O que a plataforma resolve](#o-que-a-plataforma-resolve)
- [Requisitos](#requisitos)
- [Comece em poucos minutos](#comece-em-poucos-minutos)
- [Arquitetura](#arquitetura)
- [Stack](#stack)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Segurança](#segurança)
- [Documentação](#documentação)
- [Contexto do projeto](#contexto-do-projeto)
- [Equipe](#equipe)

## O que a plataforma resolve

| Momento | Recursos |
|---|---|
| Antes do evento | cadastro de equipes com bloqueio de e-mail duplicado, login |
| Durante o evento | submissão de projeto (link https + descrição), central de avisos |
| Avaliação | notas por critério: inovação, execução técnica, apresentação |
| Encerramento | placar público com ranking |

## Requisitos

- JDK 21, Maven 3.9+, Node.js LTS, Git
- Navegador atualizado (Chrome, Edge ou Firefox)

## Comece em poucos minutos

```bash
git clone https://github.com/enzolfg/Projeto_HackathonIF.git
cd Projeto_HackathonIF
```

Terminal 1 (API em http://127.0.0.1:8080):
```bash
cd backend
mvn spring-boot:run
```

Terminal 2 (site em http://localhost:5173):
```bash
cd frontend
npm install
npm run dev
```

O banco `hackflow.db` é criado vazio na primeira execução. Para recomeçar do zero,
pare a API e apague o arquivo.

## Arquitetura

```
Navegador → React (Vite :5173) → proxy /api → Spring Boot (:8080) → SQLite
```

Na API: controle → serviço → repositório (JdbcTemplate).

## Stack

| Camada | Tecnologias |
|---|---|
| Front-end | React, Vite |
| API | Java 21, Spring Boot 3.5, JDBC |
| Dados | SQLite |
| Segurança | BCrypt, sessão por cookie HttpOnly |

## Estrutura do repositório

```
backend/    API REST (Spring Boot)
frontend/   Interface web (React + Vite)
docs/       Escopo inicial e kickoff do projeto
```

## Segurança

- Senhas com hash BCrypt; cookie HttpOnly + SameSite=Strict
- Limite de 5 tentativas de login em 15 minutos
- SQL sempre parametrizado
- **Pendente:** exigir login e papéis (jurado, comissão) nas rotas de escrita

## Documentação

| Documento | Descrição |
|---|---|
| [docs/escopo-inicial-sprint0.pdf](docs/escopo-inicial-sprint0.pdf) | Escopo inicial |
| [docs/kickoff-definicao-problema.pdf](docs/kickoff-definicao-problema.pdf) | Problema e stakeholder |
| [backend/README.md](backend/README.md) | Endpoints e detalhes da API |

## Contexto do projeto
(cole aqui Contexto, Stakeholder, Restrições, Escopo mínimo, Fora do escopo,
Backlog e Processo de desenvolvimento do README atual)

## Equipe
| Integrante |
|---|
| Enzo Leonardo Ferreira Gonçalves |
| Evellin Silva Sebastião |
| Henrique Gabriel da Silva |
| Kauã Vinicius Silva Alves |

**Engenharia de Software I** · Ciência da Computação · IFPR Campus Pinhais
