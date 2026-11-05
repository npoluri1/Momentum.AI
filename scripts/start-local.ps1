Write-Host 'Starting MomentumAI with local Ollama...' -ForegroundColor Green

# Check Ollama
if (Get-Command ollama -ErrorAction SilentlyContinue) {
    Write-Host 'Starting Ollama service...' -ForegroundColor Blue
    Start-Process ollama -ArgumentList 'serve' -WindowStyle Hidden
    Start-Sleep -Seconds 2
    ollama list
} else {
    Write-Host 'Ollama not installed. Models will use cloud APIs if configured.' -ForegroundColor Yellow
}

# Start with Docker Compose
Set-Location infra
docker-compose up --build -d
Set-Location ..
Write-Host 'Services starting...' -ForegroundColor Green
Start-Sleep -Seconds 5
docker-compose -f infra/docker-compose.yml ps
Write-Host ''
Write-Host 'Frontend: http://localhost:3003' -ForegroundColor Cyan
Write-Host 'API Gateway: http://localhost:8000/health' -ForegroundColor Cyan
Write-Host 'Agents API: http://localhost:8001/docs' -ForegroundColor Cyan
