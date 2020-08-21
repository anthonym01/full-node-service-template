@echo off
echo "Running Electron setup command (npm i electron)"
npm i electron && npm i fs-extra && npm i electron-packager
echo "electron should now be installed"
pause