#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Build script for C# Interview Prep - generates study, flash cards, and practice Q&A
.DESCRIPTION
    This script runs the build processes for:
    1. Study Site - Full documentation site from notes/ and practice/ folders
    2. Flash Cards - Auto-rotating Q&A cards with code examples
    3. Practice Q&A - Manual practice questions and answers from practice/
.EXAMPLE
    .\build-all.ps1
#>

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "C# Interview Prep - Build All Sites" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$repoRoot = $PSScriptRoot

$buildTargets = @(
    @{
        Name = "Study Site"
        Path = Join-Path $repoRoot "study-web-site"
        Script = "build.js"
        Output = "study-web-site/dist/"
    },
    @{
        Name = "Flash Cards"
        Path = Join-Path $repoRoot "flash-card-web-site"
        Script = "build.js"
        Output = "flash-card-web-site/flash-card-data.js"
    },
    @{
        Name = "Practice Q&A"
        Path = Join-Path $repoRoot "exercise-web-site"
        Script = "build.js"
        Output = "exercise-web-site/data.js"
    }
)

$buildResults = @()
$jobs = @()

Write-Host "Starting builds in parallel..." -ForegroundColor Yellow
Write-Host ""

foreach ($target in $buildTargets) {
    $buildScript = Join-Path $target.Path $target.Script
    if (-not (Test-Path $buildScript)) {
        Write-Host "[WARN] Build script not found at: $buildScript" -ForegroundColor Yellow
        $buildResults += @{
            Name = $target.Name
            Status = "Skipped"
            Output = "Build script not found"
            OutputPath = $target.Output
        }
        continue
    }

    $jobs += Start-Job -ArgumentList $target.Name, $target.Path, $target.Script -ScriptBlock {
        param($name, $path, $script)
        Push-Location $path
        try {
            $output = & node $script 2>&1 | Out-String
            $exitCode = $LASTEXITCODE
        } catch {
            $output = $_.Exception.Message
            $exitCode = 1
        } finally {
            Pop-Location
        }

        [pscustomobject]@{
            Name = $name
            ExitCode = $exitCode
            Output = $output
        }
    }
}

if ($jobs.Count -gt 0) {
    Wait-Job -Job $jobs | Out-Null
    $jobResults = $jobs | Receive-Job
    Remove-Job -Job $jobs

    foreach ($result in $jobResults) {
        $status = if ($result.ExitCode -eq 0) { "Success" } else { "Failed" }
        $buildResults += @{
            Name = $result.Name
            Status = $status
            Output = $result.Output
            OutputPath = ($buildTargets | Where-Object { $_.Name -eq $result.Name }).Output
        }
    }
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Build Summary" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$successCount = ($buildResults | Where-Object { $_.Status -eq "Success" }).Count
$failedCount = ($buildResults | Where-Object { $_.Status -eq "Failed" -or $_.Status -eq "Error" }).Count
$skippedCount = ($buildResults | Where-Object { $_.Status -eq "Skipped" }).Count

foreach ($result in $buildResults) {
    $icon = switch ($result.Status) {
        "Success" { "[OK]  " }
        "Failed"  { "[FAIL]" }
        "Error"   { "[ERR] " }
        "Skipped" { "[SKIP]" }
        default   { "[INFO]" }
    }

    $color = switch ($result.Status) {
        "Success" { "Green" }
        "Failed"  { "Red" }
        "Error"   { "Red" }
        "Skipped" { "Yellow" }
        default   { "Gray" }
    }

    Write-Host "$icon $($result.Name): $($result.Status)" -ForegroundColor $color
}

Write-Host ""
Write-Host "Total: $($buildResults.Count) builds" -ForegroundColor Gray
Write-Host "  - Successful: $successCount" -ForegroundColor Green
if ($failedCount -gt 0) {
    Write-Host "  - Failed: $failedCount" -ForegroundColor Red
}
if ($skippedCount -gt 0) {
    Write-Host "  - Skipped: $skippedCount" -ForegroundColor Yellow
}

if ($failedCount -gt 0) {
    Write-Host ""
    Write-Host "Failure output:" -ForegroundColor Red
    foreach ($result in $buildResults | Where-Object { $_.Status -eq "Failed" -or $_.Status -eq "Error" }) {
        Write-Host ""
        Write-Host "---- $($result.Name) ----" -ForegroundColor Red
        Write-Host $result.Output
    }
}

if ($successCount -eq $buildResults.Count) {
    Write-Host ""
    Write-Host "All builds completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Build outputs:" -ForegroundColor Cyan
    foreach ($result in $buildResults) {
        if ($result.OutputPath) {
            Write-Host "  - $($result.Name): $($result.OutputPath)" -ForegroundColor Gray
        }
    }
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  - Test study site:    cd study-web-site/dist && npx serve ." -ForegroundColor Gray
    Write-Host "  - Test flash cards:   cd flash-card-web-site && npx serve ." -ForegroundColor Gray
    Write-Host "  - Test practice Q&A:  cd exercise-web-site && npx serve ." -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "Some builds did not complete successfully." -ForegroundColor Yellow
    Write-Host "Review the output above for details." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
