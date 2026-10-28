param(
    [ValidateRange(1024, 65535)][int]$Port = 4173,
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$projectDirectory = $PSScriptRoot
$baseUrl = "http://127.0.0.1:$Port"
$previewUrl = "$baseUrl/education-centr/tekla-23-site-style/"

function Test-ProjectPreview {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/asset-map.json" -TimeoutSec 2
        $mapping = $response.Content | ConvertFrom-Json
        return @($mapping.PSObject.Properties.Name | Where-Object { $_ -like 'https://dev.topengineer.ru/*' }).Count -gt 0
    } catch { return $false }
}

Push-Location -LiteralPath $projectDirectory
try {
    $nodeExecutable = (Get-Command node -ErrorAction Stop).Source
    $npmExecutable = (Get-Command npm.cmd -ErrorAction Stop).Source
    $nodeMajor = [int]((& $nodeExecutable --version).TrimStart('v').Split('.')[0])
    if ($nodeMajor -lt 24) { throw 'Для проекта нужен Node.js 24 или новее. Установите Node.js 24 и повторите запуск.' }
    $viteEntry = Join-Path $projectDirectory 'node_modules/vite/bin/vite.js'
    if (-not (Test-Path -LiteralPath $viteEntry)) {
        & $npmExecutable ci
        if ($LASTEXITCODE -ne 0) { throw 'Не удалось установить зависимости.' }
    }
    & $npmExecutable run build
    if ($LASTEXITCODE -ne 0) { throw 'Не удалось собрать сайт.' }

    $previewProcess = $null
    if (-not (Test-ProjectPreview)) {
        $previewProcess = Start-Process -FilePath $nodeExecutable -ArgumentList @(
            ('"' + $viteEntry + '"'), 'preview', '--host', '127.0.0.1', '--port', $Port.ToString(), '--strictPort'
        ) -WorkingDirectory $projectDirectory -WindowStyle Hidden -PassThru `
            -RedirectStandardOutput (Join-Path $projectDirectory '.preview-server.stdout.log') `
            -RedirectStandardError (Join-Path $projectDirectory '.preview-server.stderr.log')
        $ready = $false
        for ($attempt = 0; $attempt -lt 40; $attempt++) {
            if (Test-ProjectPreview) { $ready = $true; break }
            if ($previewProcess.HasExited) { break }
            Start-Sleep -Milliseconds 200
        }
        if (-not $ready) {
            throw "Сервер не запустился. Проверьте .preview-server.stderr.log. Если порт $Port занят другим сайтом, используйте -Port 4174."
        }
    }
    Write-Host "Страница: $previewUrl"
    if (-not $NoBrowser) { Start-Process $previewUrl }
    [pscustomobject]@{ Url = $previewUrl; ProcessId = if ($previewProcess) { $previewProcess.Id } else { $null } }
} finally { Pop-Location }
