export type WorkspaceCategory = 'sales' | 'operations' | 'marketing' | 'ai-tools' | 'productivity' | 'support' | 'research';

export interface WorkspaceApp {
  id: string;
  name: string;
  description: string;
  screenshotUrl: string;
  category: WorkspaceCategory;
  team: string;
  projects: number;
  agents: number;
  flows: number;
  tags: string[];
  isCloned: boolean;
  cloneCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceDNA {
  id: string;
  name: string;
  description: string;
  category: WorkspaceCategory;
  projects: WorkspaceProject[];
  agents: WorkspaceAgent[];
  workflows: WorkspaceWorkflow[];
  icon: string;
  color: string;
}

export interface WorkspaceProject {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold' | 'archived';
  taskCount: number;
  completedTasks: number;
}

export interface WorkspaceAgent {
  id: string;
  name: string;
  description: string;
  model: string;
  provider: 'openai' | 'anthropic' | 'gemini';
  systemPrompt: string;
  tools: string[];
  memory: boolean;
  status: 'active' | 'inactive';
}

export interface WorkspaceWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: number;
  status: 'active' | 'inactive';
}
