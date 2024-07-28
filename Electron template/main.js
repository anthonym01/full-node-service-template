const { app, BrowserWindow, Menu, screen, Tray, ipcMain, Notification, systemPreferences, nativeTheme, shell } = require('electron');

//const { createPublicKey } = require('crypto');
const path = require('path');
const url = require('url');
const axios = require("axios");
const windowStateKeeper = require('electron-window-state');//https://www.npmjs.com/package/electron-window-state
const Store = require('electron-store');//Store objects (https://www.npmjs.com/package/electron-window-state)
const storeinator = new Store;//a new store
const worker = require('./utils/js/worker.js');//offload annoying things
const my_website = 'https://anthonym01.github.io/Portfolio/?contact=me';//My website

//Main body menu
const menu_body = new Menu.buildFromTemplate([
	//{ label: 'Force refresh UI', click() { maininitalizer() } },
	{ role: 'reload' },
	{ type: 'separator' },
	{ label: 'Contact developer', click() { shell.openExternal(my_website) } },
	{ role: 'toggledevtools' }
]);

//Text box menu (for convinience)
const text_box_menu = new Menu.buildFromTemplate([
	{ role: 'cut' },
	{ role: 'copy' },
	{ role: 'paste' },
	{ role: 'selectAll' },
	{ role: 'seperator' },
	{ role: 'undo' },
	{ role: 'redo' },
]);

let mainWindow = null, tray = false;

let config = {// configuration data

};

app.on('ready', function () {//App ready to roll
	console.log('storage location ', app.getPath('userData'));

	//Load configuation file
	if (storeinator.get('default')) {
		config = JSON.parse(storeinator.get('default'));
	} else {
		setstorage();
	}

	createmainWindow();
	create_tray();

	const remote_host = 'localhost:80';
	//networking example
	try {
		axios.default.post(remote_host + '/post/test', JSON.stringify(app)).finally(() => { console.log('Phoned home to: ',remote_host) })
	} catch (error) {
		console.warn('failed to phone homme: ', error)
	}

	// Desktop notification example
	let exampleNotlification = 	new Notification({ title: 'Anthonym', body: 'App start', icon: path.join(__dirname, '/build/icon.png') });
	exampleNotlification.show();

	console.log('System preference Dark mode: ', nativeTheme.shouldUseDarkColors)
	switch (process.platform) {
		case "linux":
			console.log('Anime settings: ', systemPreferences.getAnimationSettings().shouldRenderRichAnimation)
			break;
		case "win32":
			console.log('accent color: ', systemPreferences.getAccentColor())//get system accent color
			console.log('Anime settings: ', systemPreferences.getAnimationSettings().shouldRenderRichAnimation)//check if system prefers animations or not
			break;
		default://no preference

	}
});

app.on('window-all-closed', () => {//all windows closed
	if (process.platform !== 'darwin' && tray == false) { app.quit() }
});

app.on('activate', () => {//for darwin
	if (BrowserWindow.getAllWindows().length === 0) {
		createmainWindow();
	} else {
		mainWindow.show();
	}
});


function createmainWindow() {//Creates the main render process
	app.allowRendererProcessReuse = true;//Allow render processes to be reused

	//window manager plugin stuff
	const { screenwidth, screenheight } = screen.getPrimaryDisplay().workAreaSize; //gets screen size
	let mainWindowState = windowStateKeeper({
		defaultWidth: screenwidth,
		defaultHeight: screenheight
	});

	mainWindow = new BrowserWindow({//make main window
		x: mainWindowState.x,//x psoition
		y: mainWindowState.y,//y position
		width: mainWindowState.width,
		height: mainWindowState.height,
		backgroundColor: '#000000',
		frame: true,
		center: true,//center the window
		alwaysOnTop: false,
		icon: path.join(__dirname, '/build/icons/icon.png'),//some linux window managers cant process due to bug
		title: 'Blach app',
		show: true,
		//titleBarStyle: 'hiddenInset',
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: false,
			nodeIntegrationInWorker: true,
			worldSafeExecuteJavaScript: true,
			contextIsolation: false
		},
		minWidth: 400,
	})

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, '/Windows/MainWindow.html'),
		protocol: 'file:',
		slashes: true
	}))

	mainWindowState.manage(mainWindow);//give window to window manager plugin
}

function create_tray() {//Create tray
	tray = new Tray(path.join(__dirname, 'build/icon.png'))

	tray.addListener('double-click', check_main_window)//double click tray

	const contextMenu = Menu.buildFromTemplate([//build contect memu
		{ id: 'name', label: 'Blach app alpha', click() { check_main_window() } },
		{ type: 'separator' },//seperator
		{ role: 'Quit' },//quit app
	])
	tray.setToolTip('Blach app')
	tray.setContextMenu(contextMenu)
}

function check_main_window() {//Checks for main window and creates or shows it (only usefull for tray and darwin)
	if (BrowserWindow.getAllWindows().length !== 0) {//if no windows
		mainWindow.show()
	} else {
		createmainWindow()
	}
}

async function setstorage() { storeinator.set('default', JSON.stringify(config)) }


ipcMain.on('mainwindow_channel', (event, data) => {//Receive Song data from mainwindow and apply to tray
	console.log('mainwindow reports : ', data);
})

ipcMain.on('wirte_file', (event, fpath, filedata) => { worker.write_file(fpath, filedata) })

ipcMain.on('bodycontextmenu', (event) => {
	menu_body.popup({ window: mainWindow })
})