const { app, BrowserWindow, Tray, Menu, dialog ,screen } = require('electron');
const path = require('path');
const url = require('url');
const windowStateKeeper = require('electron-window-state');//preserves the window state
//const { createPublicKey } = require('crypto');

let mainWindow = null;//defines the window as an abject
let tray = null;

app.on('ready', function () {//App ready to roll
	createmainWindow()
	//create_tray()
	//Menu.setApplicationMenu(null)//Change application menu
})

function createmainWindow() {//Creates the main render process
	app.allowRendererProcessReuse = true;//Allow render processes

	//window manager plugin stuff
	const { screenwidth, screenheight } = screen.getPrimaryDisplay().workAreaSize //gets screen size
	let mainWindowState = windowStateKeeper({
		defaultWidth: screenwidth,
		defaultHeight: screenheight
	})

	mainWindow = new BrowserWindow({//make main window
		x: mainWindowState.x,//x psoition
		y: mainWindowState.y,//y position
		width: mainWindowState.width,
		height: mainWindowState.height,
		backgroundColor: '#000000',
		frame: true,
		center: true,//center the window
		alwaysOnTop: false,
		icon: path.join(__dirname, '/assets/icons/icon.ico'),
		title: 'Blach app',
		//titleBarStyle: 'hiddenInset',
		minWidth: 400,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
		}
	})

	mainWindow.loadURL(url.format({//load html into main window
		pathname: path.join(__dirname, '/BrowserWindows/MainWindow.html'),
		protocol: 'file:',
		slashes: true
	}))

	mainWindowState.manage(mainWindow);//give window to window manager plugin
}

function create_tray() {//Create tray
	tray = new Tray('assets/icons/icon.ico')

	tray.addListener('double-click', function () {//double click on tray
		if (BrowserWindow.getAllWindows().length !== 0) {
			mainWindow.show()
		} else {
			createmainWindow()
		}
	})

	const contextMenu = Menu.buildFromTemplate([//build contect memu
		{
			id: 'name', label: 'Blach app alpha'
			, click() {
				if (BrowserWindow.getAllWindows().length !== 0) {//if no windows
					mainWindow.show()
				} else {
					createmainWindow()
				}
			}
		},
		{ type: 'separator' },//seperator
		{ role: 'Quit' },//quit app
	])
	tray.setToolTip('Blach app')
	tray.setContextMenu(contextMenu)
}

app.on('window-all-closed', () => {//all windows closed
	if (process.platform !== 'darwin' && tray == null) {
		app.quit();
	}
})

app.on('activate', () => {//for darwin
	if (BrowserWindow.getAllWindows().length === 0) {
		createmainWindow();
	} else {
		mainWindow.show();
	}
});

exports.clossapp = () => { app.quit() }//export quit app

exports.minimize = () => { mainWindow.minimize() }//minimize window

exports.setontop = () => { mainWindow.setAlwaysOnTop(true) }//always on top the window

exports.setnotontop = () => { mainWindow.setAlwaysOnTop(false) }//always on top'nt the window
