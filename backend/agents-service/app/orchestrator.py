import yaml
import os
from pathlib import Path

class PromptOrchestrator:
    def __init__(self, prompt_dir="app/prompts"):
        self.prompt_dir = Path(__file__).parent / prompt_dir

    def get_prompt(self, level_name):
        file_path = self.prompt_dir / f"{level_name}.yaml"
        if not file_path.exists():
            raise FileNotFoundError(f"Prompt level {level_name} not found.")
        
        with open(file_path, 'r') as f:
            data = yaml.safe_load(f)
            return data.get('system_prompt', '')

    def assemble_context(self, levels):
        """Assembles multiple prompt levels into one unified system context."""
        context = ""
        for level in levels:
            context += self.get_prompt(level) + "\n\n"
        return context

# Example usage:
# orchestrator = PromptOrchestrator()
# system_context = orchestrator.assemble_context(['level1_root_brain', 'level2_industry_discovery'])
