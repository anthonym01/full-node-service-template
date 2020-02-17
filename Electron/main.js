const electron = require('electron');//includes electron dependency
const { app, BrowserWindow } = electron

const path = require('path');//path to necessary files
const url = require('url');//web dependency
const windowStateKeeper = require('electron-window-state');//preserves the window state

var mainWindow;//defines the window as an abject

app.on('ready', function () {
	const { screenwidth, screenheight } = electron.screen.getPrimaryDisplay().workAreaSize //gets screen size and sets it to height and width
	let mainWindowState = windowStateKeeper({
		defaultWidth: screenwidth,
		defaultHeight: screenheight
	})
	mainWindow = new BrowserWindow({
		'x': mainWindowState.x,
		'y': mainWindowState.y,
		'width': mainWindowState.width,
		'height': mainWindowState.height,
		backgroundColor: '#ffffff',
		frame: true
	})
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, '/mainWindow/index.html'),
		protocol: 'file:',
		slashes: true
	}))
	mainWindowState.manage(mainWindow);
});

app.on('window-all-closed', function () {
	if(platform !== 'darwin'){
		app.quit();
	}
});//closes all processes