from typing import Optional
from app.agents.base_agent import BaseAgent
from app.agents.agent_factory import AgentFactory
from app.schemas import OrchestrationResponse, TaskDelegation
from app.memory.conversation_memory import ConversationMemory


class AgentOrchestrator:
    def __init__(self, memory: Optional[ConversationMemory] = None):
        self.memory = memory or ConversationMemory()

    async def execute_task(
        self,
        primary_agent: BaseAgent,
        task: str,
        sub_tasks: Optional[list[TaskDelegation]] = None,
        chain: Optional[list[str]] = None,
        context: Optional[dict] = None,
        session_id: Optional[str] = None,
    ) -> OrchestrationResponse:
        intermediate_results = []
        final_output = ""

        if session_id:
            history = await self.memory.get_context(session_id)
        else:
            history = []

        if sub_tasks:
            sub_agent_results = await self._run_sub_tasks(sub_tasks, context)
            intermediate_results.append({
                "stage": "sub_tasks",
                "results": sub_agent_results,
            })
            combined_context = context or {}
            combined_context["sub_task_results"] = sub_agent_results
            context = combined_context

        if chain:
            chain_output = await self._run_chain(chain, task, context)
            intermediate_results.append({
                "stage": "chain",
                "results": chain_output,
            })
            final_output = chain_output[-1]["output"] if chain_output else ""

        if not chain:
            messages = list(history)
            user_content = task
            if context:
                user_content = f"Context: {context}\n\nTask: {task}"
            messages.append({"role": "user", "content": user_content})

            response = await primary_agent.chat(messages)
            final_output = response.content

            if session_id:
                await self.memory.add_message(session_id, "user", user_content)
                await self.memory.add_message(session_id, "assistant", final_output)
                intermediate_results.append({
                    "stage": "memory_update",
                    "session_id": session_id,
                })

        return OrchestrationResponse(
            final_output=final_output,
            intermediate_results=intermediate_results if intermediate_results else None,
        )

    async def _run_sub_tasks(
        self,
        sub_tasks: list[TaskDelegation],
        context: Optional[dict] = None,
    ) -> list[dict]:
        results = []
        for sub in sub_tasks:
            agent = AgentFactory.create_agent(
                provider="openai",
                agent_id=sub.target_agent_id,
                name=f"sub-agent-{sub.target_agent_id}",
                model_name="gpt-4o",
            )
            sub_context = context or {}
            if sub.context:
                sub_context.update(sub.context)
            response = await agent.analyze(sub.task, sub_context)
            results.append({
                "agent_id": sub.target_agent_id,
                "task": sub.task,
                "output": response,
            })
        return results

    async def _run_chain(
        self,
        chain: list[str],
        initial_task: str,
        context: Optional[dict] = None,
    ) -> list[dict]:
        outputs = []
        current_input = initial_task
        current_context = context or {}

        for i, agent_id in enumerate(chain):
            agent = AgentFactory.create_agent(
                provider="openai",
                agent_id=agent_id,
                name=f"chain-agent-{agent_id}",
                model_name="gpt-4o",
            )

            if outputs:
                current_context["previous_output"] = outputs[-1]["output"]

            messages = [{"role": "user", "content": current_input}]
            response = await agent.chat(messages)

            output = {
                "step": i,
                "agent_id": agent_id,
                "input": current_input,
                "output": response.content,
            }
            outputs.append(output)
            current_input = response.content

        return outputs
