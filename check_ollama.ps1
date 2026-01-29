
Write-Host "Checking Ollama Connection..."
try {
    $response = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get -ErrorAction Stop
    $models = $response.models
    $found = $false
    foreach ($model in $models) {
        if ($model.name -like "*gemma3:4b*") {
            $found = $true
            Write-Host "✅ Success: Found model '$($model.name)'"
        }
    }
    if (-not $found) {
        Write-Host "⚠️  Warning: Ollama is running, but 'gemma3:4b' was not found in the model list."
        Write-Host "   Available models: $($models.name -join ', ')"
        Write-Host "   Please run: ollama pull gemma3:4b"
    }
} catch {
    Write-Host "❌ Error: Could not connect to Ollama at http://localhost:11434"
    Write-Host "   Please ensure Ollama is installed and running."
}
