@echo off

REM Path to Node.js (adjust if not in PATH)
SET NODE=node

REM Path to project folder (current folder)
SET APP_DIR=%~dp0

%NODE% "%APP_DIR%src\upload.js"

REM Pause at the end (optional)
REM pause