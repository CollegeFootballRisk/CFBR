Write-Host "Waiting for backend at http://127.0.0.1:8000/openapi.json..."

$ready = $false

while (-not $ready) {
    try {
        Invoke-WebRequest `
            -Uri "http://127.0.0.1:8000/openapi.json" `
            -UseBasicParsing `
            -TimeoutSec 1 | Out-Null

        $ready = $true
        Write-Host "Backend is ready."
    }
    catch {
        Write-Host "Backend not ready yet..."
        Start-Sleep -Milliseconds 500
    }
}

Write-Host "Generating frontend API types..."

Push-Location "$PSScriptRoot/../"

try {
    npm run generate:api-types
}
finally {
    Pop-Location
}

Write-Host "API type generation complete."