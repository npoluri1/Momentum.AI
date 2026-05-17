# Global-Tasks-dos: AI Agent Architecture

## System Architecture

```
                    [Nginx :80/:443]
                           |
          +----------------+----------------+
          |                |                |
   /api/v1/*          /socket.io/*         /*
          |                |                |
    [API Gateway]    [Realtime]        [Frontend]
     FastAPI :8000    Socket.io :8004   Next.js :3000
          |
    +-----+-----+------+
    |     |      |      |
 [Agents] [CRM] [WF]  [MCP]
 :8001   :8002  :8003 :3100
    |      |      |      |
    +------+------+------+
           |
    [PostgreSQL :5432]
    [Redis :6379]
    [RabbitMQ :5672]
```

## Service Ports

| Service | Port | Tech |
|---------|------|------|
| Nginx | 80/443 | Reverse Proxy |
| Frontend | 3000 | Next.js 14 |
| API Gateway | 8000 | FastAPI |
| Agents Service | 8001 | FastAPI |
| CRM Service | 8002 | Django DRF |
| Workflow Engine | 8003 | Express |
| Realtime Service | 8004 | Socket.io |
| MCP Server | 3100 | MCP SDK |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache/PubSub |
| RabbitMQ | 5672 | Message Broker |

## Data Flow

```
User Action → Next.js → Nginx → API Gateway → Service → DB
                  ↓                                  ↓
            Socket.io Client ←── Realtime Pusub ←─── Event
```

## AI Agent System

### Supported Models
- **OpenAI**: GPT-4o, GPT-4-turbo
- **Anthropic**: Claude 3 Opus, Sonnet, Haiku
- **Google**: Gemini 1.5 Pro, 1.5 Flash

### Agent Tools
- `web_search` - Search the web
- `web_fetch` - Fetch URLs
- `data_analyzer` - Analyze structured data
- `code_executor` - Execute Python/JS code

### Memory System
- **Buffer Memory**: Recent conversation history
- **Vector Store**: ChromaDB for semantic search

## Microservices

### API Gateway (FastAPI)
- JWT Authentication
- Rate limiting via Redis
- Proxy to backend services
- Health monitoring

### Agents Service (FastAPI)
- Multi-model AI agent orchestration
- Session management
- Tool execution
- Vector memory

### CRM Service (Django DRF)
- Accounts & Organizations
- Pipeline & Deal management
- Project & Task management
- Workflow automation
- Celery async tasks

### Workflow Engine (Express)
- Event triggers
- Action execution
- Conditional branching
- Retry mechanism

### Realtime Service (Socket.io)
- Presence tracking
- Collaborative editing
- Live chat
- Push notifications
- Kanban sync
