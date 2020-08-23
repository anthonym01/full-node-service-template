"use strict";

var _require = require('electron'),
    app = _require.app,
    BrowserWindow = _require.BrowserWindow,
    Tray = _require.Tray,
    Menu = _require.Menu,
    dialog = _require.dialog,
    screen = _require.screen;

var path = require('path');

var url = require('url');

var windowStateKeeper = require('electron-window-state'); //preserves the window state


var Store = require('electron-store'); //Store objects in electron


var fs = require('fs'); //file system
//const { createPublicKey } = require('crypto');


var mainWindow = null; //defines the window as an abject

var tray = null;
var comfig = null;
app.on('ready', function () {
  //App ready to roll
  createmainWindow(); //create_tray()
  //Menu.setApplicationMenu(null)//Change application menu
});

function createmainWindow() {
  //Creates the main render process
  app.allowRendererProcessReuse = true; //Allow render processes
  //window manager plugin stuff

  var _screen$getPrimaryDis = screen.getPrimaryDisplay().workAreaSize,
      screenwidth = _screen$getPrimaryDis.screenwidth,
      screenheight = _screen$getPrimaryDis.screenheight; //gets screen size

  var mainWindowState = windowStateKeeper({
    defaultWidth: screenwidth,
    defaultHeight: screenheight
  });
  mainWindow = new BrowserWindow({
    //make main window
    x: mainWindowState.x,
    //x psoition
    y: mainWindowState.y,
    //y position
    width: mainWindowState.width,
    height: mainWindowState.height,
    backgroundColor: '#000000',
    frame: true,
    center: true,
    //center the window
    alwaysOnTop: false,
    icon: path.join(__dirname, '/assets/icons/icon.png'),
    //some linux window managers cant process due to bug
    title: 'Blach app',
    //titleBarStyle: 'hiddenInset',
    minWidth: 400,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  mainWindow.loadURL(url.format({
    //load html into main window
    pathname: path.join(__dirname, '/BrowserWindows/MainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
  mainWindowState.manage(mainWindow); //give window to window manager plugin
}

function create_tray() {
  //Create tray
  tray = new Tray('assets/icons/icon.png');
  tray.addListener('double-click', function () {
    //double click on tray
    if (BrowserWindow.getAllWindows().length !== 0) {
      mainWindow.show();
    } else {
      createmainWindow();
    }
  });
  var contextMenu = Menu.buildFromTemplate([//build contect memu
  {
    id: 'name',
    label: 'Blach app alpha',
    click: function click() {
      if (BrowserWindow.getAllWindows().length !== 0) {
        //if no windows
        mainWindow.show();
      } else {
        createmainWindow();
      }
    }
  }, {
    type: 'separator'
  }, //seperator
  {
    role: 'Quit'
  } //quit app
  ]);
  tray.setToolTip('Blach app');
  tray.setContextMenu(contextMenu);
}

app.on('window-all-closed', function () {
  //all windows closed
  if (process.platform !== 'darwin' && tray == null) {
    app.quit();
  }
});
app.on('activate', function () {
  //for darwin
  if (BrowserWindow.getAllWindows().length === 0) {
    createmainWindow();
  } else {
    mainWindow.show();
  }
});

function write_file(filepath, buffer_data) {
  return regeneratorRuntime.async(function write_file$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(filepath, buffer_data);
          fs.writeFile(filepath, buffer_data, 'utf8', function (err) {
            //write config to file as json
            if (err) {
              alert("An error occurred creating the file" + err.message);
            } else {
              console.log("The file has been successfully saved to: ", filepath);
            }
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}

exports.write_object_json_out = function (filepath, buffer_data) {
  write_file(filepath, buffer_data);
};

exports.clossapp = function () {
  app.quit();
}; //export quit app


exports.minimize = function () {
  mainWindow.minimize();
}; //minimize window


exports.setontop = function () {
  mainWindow.setAlwaysOnTop(true);
}; //always on top the window


exports.setnotontop = function () {
  mainWindow.setAlwaysOnTop(false);
}; //always on top'nt the window