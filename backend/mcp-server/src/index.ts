import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ToolSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8000/api/v1';

const server = new Server(
  { name: 'global-tasks-mcp', version: '1.0.0' },
  { capabilities: { tools: {}, resources: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_workspaces',
      description: 'List workspace apps from the gallery',
      inputSchema: {
        type: 'object',
        properties: {
          category: { type: 'string', description: 'Filter by category (sales, operations, marketing, etc.)' },
          search: { type: 'string', description: 'Search workspaces by name' },
        },
      },
    },
    {
      name: 'clone_workspace',
      description: 'Clone a workspace app into your account',
      inputSchema: {
        type: 'object',
        properties: {
          workspaceId: { type: 'string', description: 'ID of the workspace to clone' },
        },
        required: ['workspaceId'],
      },
    },
    {
      name: 'create_project',
      description: 'Create a new project in the workspace',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Project name' },
          description: { type: 'string', description: 'Project description' },
        },
        required: ['name'],
      },
    },
    {
      name: 'list_projects',
      description: 'List all projects in the workspace',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'create_task',
      description: 'Create a new task in a project',
      inputSchema: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project ID' },
          title: { type: 'string', description: 'Task title' },
          description: { type: 'string', description: 'Task description' },
          priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
        },
        required: ['projectId', 'title'],
      },
    },
    {
      name: 'list_agents',
      description: 'List all AI agents in the workspace',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'create_agent',
      description: 'Create a new AI agent',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Agent name' },
          description: { type: 'string', description: 'Agent description' },
          model: { type: 'string', enum: ['gpt-4o', 'claude-3.5', 'gemini-pro'] },
          systemPrompt: { type: 'string', description: 'System prompt for the agent' },
        },
        required: ['name', 'model'],
      },
    },
    {
      name: 'chat_with_agent',
      description: 'Send a message to an AI agent and get a response',
      inputSchema: {
        type: 'object',
        properties: {
          agentId: { type: 'string', description: 'Agent ID' },
          message: { type: 'string', description: 'Your message to the agent' },
        },
        required: ['agentId', 'message'],
      },
    },
    {
      name: 'list_workflows',
      description: 'List all automation workflows',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'create_workflow',
      description: 'Create a new automation workflow',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Workflow name' },
          description: { type: 'string', description: 'Workflow description' },
          trigger: { type: 'string', description: 'Trigger type (webhook, schedule, event)' },
        },
        required: ['name'],
      },
    },
    {
      name: 'execute_workflow',
      description: 'Execute a workflow immediately',
      inputSchema: {
        type: 'object',
        properties: {
          workflowId: { type: 'string', description: 'Workflow ID' },
          payload: { type: 'object', description: 'Payload to pass to the workflow' },
        },
        required: ['workflowId'],
      },
    },
    {
      name: 'generate_app',
      description: 'Generate a new app from a natural language prompt (Genesis)',
      inputSchema: {
        type: 'object',
        properties: {
          prompt: { type: 'string', description: 'Describe the app you want to build' },
          type: { type: 'string', enum: ['dashboard', 'crm', 'website', 'form', 'tracker', 'store', 'agent', 'workflow'] },
        },
        required: ['prompt'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_workspaces': {
        const params = new URLSearchParams();
        if (args?.category) params.set('category', args.category as string);
        if (args?.search) params.set('search', args.search as string);
        const res = await fetch(`${API_BASE}/gallery/workspaces?${params}`);
        const data = await res.json();
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'clone_workspace': {
        const { workspaceId } = z.object({ workspaceId: z.string() }).parse(args);
        const res = await fetch(`${API_BASE}/gallery/clone`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workspaceId }),
        });
        const data = await res.json();
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'create_project': {
        const { name, description } = z.object({ name: z.string(), description: z.string().optional() }).parse(args);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ id: crypto.randomUUID(), name, description, status: 'active', tasks: 0, createdAt: new Date().toISOString() }, null, 2),
          }],
        };
      }

      case 'list_projects': {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify([
              { id: 'proj-1', name: 'Sales Pipeline', status: 'active', tasks: 24, completed: 18 },
              { id: 'proj-2', name: 'CRM Implementation', status: 'active', tasks: 32, completed: 14 },
              { id: 'proj-3', name: 'Customer Portal', status: 'active', tasks: 18, completed: 16 },
            ], null, 2),
          }],
        };
      }

      case 'create_task': {
        const taskInput = z.object({ projectId: z.string(), title: z.string(), description: z.string().optional(), priority: z.string().optional() }).parse(args);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ id: crypto.randomUUID(), ...taskInput, status: 'todo', createdAt: new Date().toISOString() }, null, 2),
          }],
        };
      }

      case 'list_agents': {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify([
              { id: 'agent-1', name: 'Lead Enricher', model: 'GPT-4o', status: 'active', conversations: 1247 },
              { id: 'agent-2', name: 'SDR Agent', model: 'Claude 3.5', status: 'active', conversations: 843 },
              { id: 'agent-3', name: 'Content Writer', model: 'GPT-4o', status: 'active', conversations: 2156 },
              { id: 'agent-4', name: 'Code Reviewer', model: 'Claude 3.5', status: 'active', conversations: 567 },
            ], null, 2),
          }],
        };
      }

      case 'create_agent': {
        const agentInput = z.object({ name: z.string(), description: z.string().optional(), model: z.string(), systemPrompt: z.string().optional() }).parse(args);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ id: crypto.randomUUID(), ...agentInput, status: 'active', conversations: 0, createdAt: new Date().toISOString() }, null, 2),
          }],
        };
      }

      case 'chat_with_agent': {
        const chatInput = z.object({ agentId: z.string(), message: z.string() }).parse(args);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ role: 'assistant', content: `This is a simulated response from agent ${chatInput.agentId}. Your message was: "${chatInput.message}"`, timestamp: new Date().toISOString() }, null, 2),
          }],
        };
      }

      case 'list_workflows': {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify([
              { id: 'wf-1', name: 'Lead Scoring Pipeline', trigger: 'New lead created', steps: 5, status: 'active', runs: 1247 },
              { id: 'wf-2', name: 'Deal Stage Notification', trigger: 'Deal stage changed', steps: 3, status: 'active', runs: 843 },
              { id: 'wf-3', name: 'Content Publishing Flow', trigger: 'Content approved', steps: 7, status: 'active', runs: 356 },
            ], null, 2),
          }],
        };
      }

      case 'create_workflow': {
        const wfInput = z.object({ name: z.string(), description: z.string().optional(), trigger: z.string().optional() }).parse(args);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ id: crypto.randomUUID(), ...wfInput, steps: [], status: 'inactive', createdAt: new Date().toISOString() }, null, 2),
          }],
        };
      }

      case 'execute_workflow': {
        const execInput = z.object({ workflowId: z.string(), payload: z.any().optional() }).parse(args);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ executionId: crypto.randomUUID(), workflowId: execInput.workflowId, status: 'running', startedAt: new Date().toISOString() }, null, 2),
          }],
        };
      }

      case 'generate_app': {
        const genInput = z.object({ prompt: z.string(), type: z.string().optional() }).parse(args);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              appId: crypto.randomUUID(),
              name: genInput.prompt.split(' ').slice(0, 3).join(' '),
              type: genInput.type || 'app',
              status: 'building',
              message: `Generated app from prompt: "${genInput.prompt}"`,
              url: `https://app.globaltasks.io/app/${crypto.randomUUID()}`,
            }, null, 2),
          }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true };
  }
});

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'momentum://workspace/overview',
      name: 'Workspace Overview',
      description: 'Overview of the current workspace with stats',
      mimeType: 'application/json',
    },
    {
      uri: 'momentum://agents/list',
      name: 'AI Agents List',
      description: 'List of all AI agents in the workspace',
      mimeType: 'application/json',
    },
    {
      uri: 'momentum://projects/list',
      name: 'Projects List',
      description: 'List of all projects in the workspace',
      mimeType: 'application/json',
    },
    {
      uri: 'momentum://workflows/list',
      name: 'Workflows List',
      description: 'List of all automation workflows',
      mimeType: 'application/json',
    },
    {
      uri: 'momentum://gallery',
      name: 'Workspace Gallery',
      description: 'Community workspace gallery with cloneable apps',
      mimeType: 'application/json',
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  const resources: Record<string, string> = {
    'momentum://workspace/overview': JSON.stringify({
      projects: 12,
      activeAgents: 8,
      workflows: 15,
      tasksCompleted: 847,
      members: 5,
      storageUsed: '2.4 GB',
    }),
    'momentum://agents/list': JSON.stringify([
      { id: 'agent-1', name: 'Lead Enricher', model: 'GPT-4o', status: 'active' },
      { id: 'agent-2', name: 'SDR Agent', model: 'Claude 3.5', status: 'active' },
    ]),
    'momentum://projects/list': JSON.stringify([
      { id: 'proj-1', name: 'Sales Pipeline', tasks: 24, completed: 18 },
      { id: 'proj-2', name: 'CRM', tasks: 32, completed: 14 },
    ]),
    'momentum://workflows/list': JSON.stringify([
      { id: 'wf-1', name: 'Lead Scoring', trigger: 'New lead', runs: 1247 },
      { id: 'wf-2', name: 'Deal Notifications', trigger: 'Stage change', runs: 843 },
    ]),
    'momentum://gallery': JSON.stringify([
      { id: 'app-1', name: 'Sales Pipeline', category: 'Sales', clones: 1247 },
      { id: 'app-2', name: 'CRM Dashboard', category: 'Sales', clones: 892 },
    ]),
  };

  const content = resources[uri];
  if (!content) {
    throw new Error(`Unknown resource: ${uri}`);
  }

  return {
    contents: [{ uri, mimeType: 'application/json', text: content }],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Global Tasks MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
