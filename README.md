<p align="center">
  <img src="docs/img/banner.svg" alt="HackFlow" width="100%">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21">
  <img src="https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-Sprint_0_conclu%C3%ADda-A6721E?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/metodologia-Kanban-2F6F68?style=flat-square" alt="Kanban">
  <img src="https://img.shields.io/badge/IFPR-Pinhais-14213D?style=flat-square" alt="IFPR Pinhais">
</p>

<p align="center">
  <a href="#-sobre">Sobre</a> ·
  <a href="#-funcionalidades">Funcionalidades</a> ·
  <a href="#-como-funciona">Como funciona</a> ·
  <a href="#-rodando-na-sua-máquina">Rodar</a> ·
  <a href="#-roadmap">Roadmap</a> ·
  <a href="#-equipe">Equipe</a>
</p>

---

## 📌 Sobre

O **HackFlow** nasceu para o 1º Hackathon do curso de Ciência da Computação do IFPR, Campus Pinhais. Hoje, inscrição, submissão, avaliação e divulgação dos resultados dependem de planilhas, e-mail e WhatsApp. O sistema junta tudo em um lugar só.

> [!NOTE]
> Projeto desenvolvido na disciplina de **Engenharia de Software I**, com a comissão organizadora do evento como cliente.

<table>
  <tr>
    <td>🔁 <b>Antes</b><br>Inscrições duplicadas e dados desencontrados</td>
    <td>📢 <b>Antes</b><br>Avisos espalhados em vários canais</td>
    <td>🐢 <b>Antes</b><br>Avaliação em papel e apuração lenta</td>
  </tr>
  <tr>
    <td>✅ <b>Agora</b><br>Cadastro validado, e-mail único</td>
    <td>✅ <b>Agora</b><br>Central de avisos única</td>
    <td>✅ <b>Agora</b><br>Notas por critério e ranking automático</td>
  </tr>
</table>

## ✨ Funcionalidades

| | | |
|:---:|:---:|:---:|
| 📝 **Cadastro de equipes**<br><sub>3 a 5 integrantes, e-mail único</sub> | 🔐 **Login seguro**<br><sub>Senha com BCrypt e sessão por cookie</sub> | 📦 **Submissão de projeto**<br><sub>Link https e descrição</sub> |
| 🧑‍⚖️ **Avaliação por critério**<br><sub>Inovação, execução e apresentação</sub> | 🏆 **Placar público**<br><sub>Ranking calculado automaticamente</sub> | 📣 **Central de avisos**<br><sub>Com destaque para urgentes</sub> |

## 🖼️ Telas

<details>
<summary><b>Clique para ver as telas</b></summary>
<br>

| Cadastro | Painel | Placar |
|:---:|:---:|:---:|
| <img src="docs/img/cadastro.png" width="260"> | <img src="docs/img/painel.png" width="260"> | <img src="docs/img/placar.png" width="260"> |

</details>

🎨 [Protótipo no Figma](Lhttps://www.figma.com/proto/QS1GKDNAEhnb1yGT2AE05r/HackFlow-%E2%80%93-IFPR-Campus-Pinhais?node-id=1-2&p=f&t=KCOmZhu1FK5gHDVr-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1) 

## 🧭 Como funciona

```mermaid
flowchart LR
  U([👤 Usuário]) --> F["⚛️ React + Vite<br/>porta 5173"]
  F -- "/api" --> A["☕ Spring Boot<br/>porta 8080"]
  A --> D[("🗄️ SQLite<br/>hackflow.db")]
```

## ⚙️ Rodando na sua máquina

**Você precisa de:** JDK 21 · Maven 3.9+ · Node.js LTS · Git

```bash
git clone https://github.com/enzolfg/Projeto_HackathonIF.git
cd Projeto_HackathonIF
```

<table>
<tr>
<th>🖥️ Terminal 1: API</th>
<th>🌐 Terminal 2: Site</th>
</tr>
<tr>
<td>

```bash
cd backend
mvn spring-boot:run
```

</td>
<td>

```bash
cd frontend
npm install
npm run dev
```

</td>
</tr>
</table>

Depois abra **http://localhost:5173** 🎉

> [!TIP]
> O banco `hackflow.db` é criado vazio na primeira execução. Para recomeçar do zero, pare a API e apague o arquivo.

> [!WARNING]
> Ligue a **API antes** do site. Sem ela, as telas mostram "Não foi possível conectar ao servidor".

## 🧰 Tecnologias

| Camada | Tecnologias |
|---|---|
| 🎨 Interface | React, Vite |
| ⚙️ API | Java 21, Spring Boot 3.5, JDBC (`JdbcTemplate`) |
| 🗄️ Dados | SQLite |
| 🔒 Segurança | BCrypt, cookie HttpOnly + SameSite=Strict |

## 📂 Estrutura

```
Projeto_HackathonIF/
├── 📁 backend/     API REST (Spring Boot)
├── 📁 frontend/    Interface web (React + Vite)
├── 📁 docs/        Escopo, kickoff e imagens
└── 📄 README.md
```

## 🔐 Segurança

| Item | Situação |
|---|:---:|
| Senhas com hash BCrypt | ✅ |
| Cookie HttpOnly + SameSite=Strict | ✅ |
| Limite de 5 tentativas de login em 15 min | ✅ |
| SQL sempre parametrizado | ✅ |
| Exigir login e papéis (jurado, comissão) nas rotas de escrita | 🔜 |
| HTTPS e recuperação de senha | 🔜 |

## 🗺️ Roadmap

- [x] Kickoff e definição do problema
- [x] Escopo inicial (Sprint 0)
- [x] Protótipo de interface
- [x] API com cadastro, login, projetos, notas e avisos
- [x] Front-end integrado à API
- [ ] Papéis de acesso (participante, jurado, comissão)
- [
