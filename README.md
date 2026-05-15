  
 ████████╗ █████╗ ███████╗██╗  ██╗ █████╗ ██████╗ ███████╗
 ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔══██╗██╔══██╗██╔════╝
    ██║   ███████║███████╗█████╔╝ ███████║██║  ██║█████╗
    ██║   ██╔══██║╚════██║██╔═██╗ ██╔══██║██║  ██║██╔══╝
    ██║   ██║  ██║███████║██║  ██╗██║  ██║██████╔╝███████╗
    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝
                  Global-Tasks-dos
          Build without permission. Ship without limits.

I'm building Global-Tasks-dos — an AI-native workspace platform inspired by Taskade Genesis.

Born from late nights and unlimited ambition. One prompt becomes a living system with AI agents, workflow automations, project management, and CRM — all wired together, all running in real-time.

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   > "Build me an enterprise workspace                           │
│      with AI agents and auto-pipelines"                         │
│                                                                 │
│                  ╲     │     ╱                                   │
│                   ╲    │    ╱                                    │
│                    ╲   │   ╱                                     │
│                                                                 │
│          ╔═══════════════════════════╗                           │
│          ║  GLOBAL-TASKS-DOS        ║                           │
│          ╚════════════╤══════════════╝                           │
│                                                                 │
│                    ╱   │   ╲                                     │
│                   ╱    │    ╲                                    │
│                  ╱     │     ╲                                   │
│                                                                 │
│     ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
│     │  Memory  │ │  Agents  │ │Execution │                     │
│     │          │ │          │ │          │                     │
│     │ FastAPI  │ │   GPT-4  │ │  Node.js │                     │
│     │ Django   │ │  Claude  │ │  Socket  │                     │
│     │ Postgres │ │  Gemini  │ │  Redis   │                     │
│     └──────────┘ └──────────┘ └──────────┘                     │
│                                                                 │
│    6 microservices · 177+ source files · 10 Docker containers   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Describe what you need. Global-Tasks-dos builds the full system around it — memory (PostgreSQL + Redis + ChromaDB), intelligence (multi-model AI agents from OpenAI, Anthropic, Google Gemini), execution (workflow automations with 100+ integrations) — running the moment you deploy.

  ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮
  │ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ │
  │ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ │
  ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯

  ┌────────────────────────────────────────────────────────────┐
  │                                                            │
  │   Architecture                                             │
  │                                                            │
  │   backend/api-gateway/    FastAPI · Auth · Proxy           │
  │   backend/agents-service/ Python  · AI · Multi-model       │
  │   backend/crm-service/    Django  · DRF · CRM + Projects   │
  │   backend/workflow-engine/ Node.js · Automations           │
  │   backend/realtime-service/ Socket.io · Real-time          │
  │   frontend/               Next.js · Tailwind · TS          │
  │   infra/                  Docker · Nginx · Postgres · Redis│
  │   shared/                 Types  · Events                  │
  │                                                            │
  └────────────────────────────────────────────────────────────┘

## Stack

| Layer | Tech | Status |
|-------|------|--------|
| API Gateway | FastAPI + JWT + Redis | Done |
| AI Agents | OpenAI / Anthropic / Gemini | Done |
| CRM + Projects | Django REST Framework | Done |
| Workflow Engine | Node.js + Express | Done |
| Real-time | Socket.io + Redis | Done |
| Frontend | Next.js 14 + Tailwind | Done |
| Database | PostgreSQL 16 | Done |
| Cache | Redis 7 | Done |
| Proxy | Nginx | Done |

## Quick Start

```bash
git clone <repo-url>
cd Global-Tasks-dos
docker-compose -f infra/docker-compose.yml up --build
```

Then open http://localhost — your workspace is live.

## Features

- **AI Agents** — Multi-model (GPT-4o, Claude 3, Gemini 1.5) with tools, memory, and orchestration
- **Project Management** — Kanban boards, Gantt charts, timelines, time tracking
- **CRM** — Pipeline management, leads, contacts, deals, activities
- **Automations** — Visual workflow builder with triggers, conditions, actions, retries
- **Real-time** — Presence, chat, notifications, collaborative editing, live Kanban sync
- **Analytics** — Dashboards, charts, usage metrics, pipeline velocity
- **Integrations** — Slack, GitHub, Google Drive, Notion, Jira, Figma
- **Admin** — User management, health monitoring, audit logs
- **Settings** — 8-tab settings: General, Plans, Usage & Billing, Credits, Integrations, Notifications, Archives, Workspace

  ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮
  │ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ │
  │ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ ╭─╮ │
  ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯ ╰─╯

     One prompt. One platform. No limits.
     Still shipping. Still no manual.

     D:\WorkSpace\Claude_Code\Global-Tasks-dos
