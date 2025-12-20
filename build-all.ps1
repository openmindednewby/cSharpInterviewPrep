#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Build script for C# Interview Prep - generates both study site and flash cards
.DESCRIPTION
    This script runs the build processes for:
    1. Study Site - Full documentation site from notes/ and practice/ folders
    2. Flash Cards - Auto-rotating Q&A cards with code examples
.EXAMPLE
    .\build-all.ps1
#>

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "C# Interview Prep - Build All Sites" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Get the repository root
$repoRoot = $PSScriptRoot

# Track build results
$buildResults = @()

# ============================================
# Build Study Site
# ============================================
Write-Host "[1/2] Building Study Site..." -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Gray

$studySitePath = Join-Path $repoRoot "study-site"
$studyBuildScript = Join-Path $studySitePath "build.js"

if (Test-Path $studyBuildScript) {
    Push-Location $studySitePath
    try {
        Write-Host "Running: node build.js" -ForegroundColor Gray
        $studyOutput = node build.js 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Study site built successfully!" -ForegroundColor Green
            Write-Host $studyOutput -ForegroundColor Gray
            $buildResults += @{ Name = "Study Site"; Status = "Success"; Output = $studyOutput }
        } else {
            Write-Host "[FAIL] Study site build failed!" -ForegroundColor Red
            Write-Host $studyOutput -ForegroundColor Red
            $buildResults += @{ Name = "Study Site"; Status = "Failed"; Output = $studyOutput }
        }
    }
    catch {
        Write-Host "[ERROR] Error building study site: $_" -ForegroundColor Red
        $buildResults += @{ Name = "Study Site"; Status = "Error"; Output = $_.Exception.Message }
    }
    finally {
        Pop-Location
    }
} else {
    Write-Host "[WARN] Study site build script not found at: $studyBuildScript" -ForegroundColor Yellow
    $buildResults += @{ Name = "Study Site"; Status = "Skipped"; Output = "Build script not found" }
}

Write-Host ""

# ============================================
# Build Flash Cards
# ============================================
Write-Host "[2/2] Building Flash Cards..." -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Gray

$flashCardPath = Join-Path $repoRoot "flash-card-web-site"
$flashCardBuildScript = Join-Path $flashCardPath "build.js"

if (Test-Path $flashCardBuildScript) {
    Push-Location $flashCardPath
    try {
        Write-Host "Running: node build.js" -ForegroundColor Gray
        $flashCardOutput = node build.js 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Flash cards built successfully!" -ForegroundColor Green
            Write-Host $flashCardOutput -ForegroundColor Gray
            $buildResults += @{ Name = "Flash Cards"; Status = "Success"; Output = $flashCardOutput }
        } else {
            Write-Host "[FAIL] Flash cards build failed!" -ForegroundColor Red
            Write-Host $flashCardOutput -ForegroundColor Red
            $buildResults += @{ Name = "Flash Cards"; Status = "Failed"; Output = $flashCardOutput }
        }
    }
    catch {
        Write-Host "[ERROR] Error building flash cards: $_" -ForegroundColor Red
        $buildResults += @{ Name = "Flash Cards"; Status = "Error"; Output = $_.Exception.Message }
    }
    finally {
        Pop-Location
    }
} else {
    Write-Host "[WARN] Flash card build script not found at: $flashCardBuildScript" -ForegroundColor Yellow
    $buildResults += @{ Name = "Flash Cards"; Status = "Skipped"; Output = "Build script not found" }
}

# ============================================
# Summary
# ============================================
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

# ============================================
# Next Steps
# ============================================
if ($successCount -eq $buildResults.Count) {
    Write-Host ""
    Write-Host "All builds completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Build outputs:" -ForegroundColor Cyan
    Write-Host "  - Study Site:    study-site/dist/" -ForegroundColor Gray
    Write-Host "  - Flash Cards:   flash-card-web-site/flash-card-data.js" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  - Test study site:    cd study-site/dist && npx serve ." -ForegroundColor Gray
    Write-Host "  - Test flash cards:   cd flash-card-web-site && npx serve ." -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "Some builds did not complete successfully." -ForegroundColor Yellow
    Write-Host "Review the output above for details." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
