@echo off
setlocal enabledelayedexpansion

REM ----------------------------
REM Configuration
REM ----------------------------
set APP_NAME=Kiegle6307
set NODE_VERSION=22.11.0
set NODE_DIR=node
set APP_DIR=app
set DIST_DIR=dist
set ZIP_NAME=%APP_NAME%.zip

REM ----------------------------
echo Cleaning old dist...
REM ----------------------------
if exist %DIST_DIR% rmdir /s /q %DIST_DIR%
mkdir %DIST_DIR%
mkdir %DIST_DIR%\%NODE_DIR%
mkdir %DIST_DIR%\%APP_DIR%

REM ----------------------------
echo Downloading portable node (if needed)...
REM ----------------------------
if not exist node-download (
    mkdir node-download
)

if not exist node-download\node-v%NODE_VERSION%-win-x64.zip (
    powershell -command "Invoke-WebRequest https://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-win-x64.zip -OutFile node-download/node.zip"
    powershell -command "Expand-Archive node-download/node.zip -DestinationPath node-download -Force"
    rename node-download\node-v%NODE_VERSION%-win-x64 node-v%NODE_VERSION%
)

REM ----------------------------
echo Copying Node into dist...
REM ----------------------------
xcopy /e /i /y node-download\node-v%NODE_VERSION% %DIST_DIR%\%NODE_DIR%\

REM ----------------------------
echo Copying app files...
REM ----------------------------
xcopy /e /i /y %APP_DIR% %DIST_DIR%\%APP_DIR%\

REM ----------------------------
echo Installing production dependencies...
REM ----------------------------
pushd %DIST_DIR%\%APP_DIR%
..\..\%NODE_DIR%\node.exe ..\..\%NODE_DIR%\npm install --omit=dev
popd

REM ----------------------------
echo Creating run.bat launcher...
REM ----------------------------
(
echo @echo off
echo "%%~dp0%NODE_DIR%\node.exe" "%%~dp0%APP_DIR%\index.js"
echo pause
) > %DIST_DIR%\run.bat

REM ----------------------------
echo Creating ZIP package...
REM ----------------------------
if exist %ZIP_NAME% del %ZIP_NAME%
powershell -command "Compress-Archive -Path '%DIST_DIR%\*' -DestinationPath '%ZIP_NAME%'"

echo.
echo ✅ Build complete!
echo ✅ Output zip: %ZIP_NAME%
echo.

endlocal
