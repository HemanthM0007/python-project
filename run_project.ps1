# PowerShell script to run both the FastAPI Backend and React Frontend in separate windows

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   SOLAR SENTRY - AI DETECTION SYSTEM LAUNCHER  " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Starting services..." -ForegroundColor Yellow

# 1. Start Backend FastAPI Server
Write-Host "[+] Launching FastAPI Backend on http://localhost:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; ..\venv\Scripts\activate; uvicorn app.main:app --reload --port 8000"

# 2. Start Frontend React Vite Server
Write-Host "[+] Launching React Frontend on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "---------------------------------------------" -ForegroundColor Cyan
Write-Host "All systems launched successfully!" -ForegroundColor Green
Write-Host "- Backend API Docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "- Frontend Dashboard: http://localhost:5173" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Cyan
