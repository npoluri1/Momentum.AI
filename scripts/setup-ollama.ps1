# Setup Ollama with free local models
Write-Host 'Setting up Ollama...' -ForegroundColor Green

# Check if Ollama is installed
if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
    Write-Host 'Ollama not found. Please download from https://ollama.com/download' -ForegroundColor Yellow
    Write-Host 'After installation, run this script again.' -ForegroundColor Yellow
    exit 1
}

# Pull recommended models for Genesis (can run on moderate hardware)
Write-Host 'Pulling qwen2.5:7b-instruct...' -ForegroundColor Blue
ollama pull qwen2.5:7b-instruct

Write-Host 'Pulling llama3.2:3b-instruct (lighter alternative)...' -ForegroundColor Blue
ollama pull llama3.2:3b-instruct

Write-Host 'Pulling mistral-nemo:latest...' -ForegroundColor Blue
ollama pull mistral-nemo:latest

Write-Host 'Ollama models ready!' -ForegroundColor Green
ollama list
