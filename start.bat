@echo off
echo Starting Barber Shop Appointment Scheduler...
echo.

REM Start Backend
echo Starting backend server on port 5000...
start cmd /k "cd backend && npm install && npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start Frontend
echo Starting frontend application on port 3000...
start cmd /k "cd frontend && npm install && npm start"

echo.
echo ========================================
echo Application is starting!
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Close the command windows to stop the application.
echo ========================================
pause
