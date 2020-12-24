const { ipcRenderer, remote } = require('electron');

const main = remote.require('./main');//acess export functions in main
const { dialog, Menu, MenuItem, systemPreferences, nativeTheme, clipboard, shell } = remote;//Acess to electron dependencies
const fs = require('fs');//file system

const my_website = 'https://anthonym01.github.io/Portfolio/?contact=me';//My website
const remote_host = 'http://localhost:1999';

window.addEventListener('load', function () {//window loads
    create_body_menu()
    create_text_menus()

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
    console.log('System preference Dark mode: ', nativeTheme.shouldUseDarkColors)

    if (localStorage.getItem("APPnamecfg")) { config.load() }// else { config.data = {} }

    maininitalizer()
})

function maininitalizer() {//Used to start re-startable app functions
    console.log('main initalizer')
    ipcRenderer.send('mainwindow_channel', 'Initalized')//Send window reinitalized to main

}

//text box menus
async function create_text_menus() {
    const text_box_menu = new Menu.buildFromTemplate([//Text box menu (for convinience)
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
        { role: 'seperator' },
        { role: 'undo' },
        { role: 'redo' },
    ]);
    //add events to text boxes
    textbox.addEventListener('contextmenu', (event) => popupmenu, false)

    //Popup the menu in this window
    function popupmenu(event) {
        event.preventDefault()
        event.stopPropagation()
        text_box_menu.popup({ window: require('electron').remote.getCurrentWindow() })
    }
}

//Body menu
async function create_body_menu() {
    const menu_body = new Menu.buildFromTemplate([//Main body menu
        { label: 'Force refresh UI', click() { maininitalizer() } },
        { role: 'reload' },
        { type: 'separator' },
        { label: 'Contact developer', click() { shell.openExternal(my_website) } },
        { role: 'toggledevtools' }
    ]);

    Menu.setApplicationMenu(menu_body)

    window.addEventListener('contextmenu', (e) => {//Body menu attached to window
        e.preventDefault();
        menu_body.popup({ window: remote.getCurrentWindow() })//popup menu
    }, false);
}


let config = {
    data: {//application data
        key: "APPnamecfg",
    },
    save: async function () {//Save the config file
        console.table('Configuration is being saved', config.data)
        ipcRenderer.send('alt_storage_file', config.data)
        localStorage.setItem("APPnamecfg", JSON.stringify(config.data))
    },
    load: function () {//Load the config file
        console.warn('Configuration is being loaded')

        if (main.get.alt_location() != false) {//Load from alt location
            //load from alternate storage location
            if (fs.existsSync(main.get.alt_location() + "/APPnamecfg config.json")) {//Directory exists
                var fileout = fs.readFileSync(main.get.alt_location() + "/APPnamecfg config.json", { encoding: 'utf8' })//Read from file with charset utf8
                console.warn('config Loaded from: ', main.get.alt_location(), 'Data from fs read operation: ', fileout)
                fileout = JSON.parse(fileout)//parse the json
                if (fileout.key == "APPnamecfg") {//check if file has key
                    config.data = fileout;
                    console.warn('configuration applied from file')
                } else {//no key, not correct file, load from application storage
                    console.warn('The file is not a config file, internal configuration will be used')
                    config.data = JSON.parse(localStorage.getItem("APPnamecfg"))
                }
            } else {//file does not exist, was moved, deleted or is inaccesible
                config.data = JSON.parse(localStorage.getItem("APPnamecfg"))
                notify.new("Error", "file does not exist, was moved, deleted or is otherwise inaccesible, click to select a new location to save app data", '', function () { config.selectlocation(); })
            }
        } else {//load from application storage
            config.data = JSON.parse(localStorage.getItem("APPnamecfg"))
            console.log('config Loaded from application storage')
        }

        console.table(config.data)
    },
    delete: function () {//Wjipe stowage
        localStorage.clear("APPnamecfg")//yeet storage key
        config.usedefault();//use default location
        console.log('config deleted: ')
        console.table(config.data)
    },
    backup: async function () {//backup configuration to a file
        console.warn('Configuration backup initiated')

        var date = new Date();

        var filepath = dialog.showSaveDialog(remote.getCurrentWindow(), {//electron file save dialogue
            defaultPath: "APPnamecfg backup " + Number(date.getMonth() + 1) + " - " + date.getDate() + " - " + date.getFullYear(),
            buttonLabel: "Save", filters: [{ name: 'JSON', extensions: ['json'] }]
        });

        await filepath.then((filepath) => {//resolve filepath promise
            if (filepath.canceled == true) {//the file save dialogue was canceled my the user
                console.warn('The file dialogue was canceled by the user')
            } else {
                ipcRenderer.send('wirte_file', filepath.filePath, JSON.stringify(config.data))
            }
        }).catch((err) => { alert('An error occured ', err.message); })
    },
    restore: async function () {//restore configuration from a file
        console.warn('Configuration restoration initiated')

        dialog.showOpenDialog(remote.getCurrentWindow(), {
            buttonLabel: "open", filters: [
                { name: 'Custom File Type', extensions: ['json'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        }).then((filepath) => {
            console.log(filepath)
            if (filepath.canceled == true) {//diologue ccanceled
                console.log("diologue ccanceled");
            } else {
                fs.readFile(filepath.filePaths[0], 'utf-8', (err, data) => {//load data from file
                    if (err) {
                        alert("An error ocurred reading the file :" + err.message)
                    } else {
                        console.log("The file content is : " + data);
                        var fileout = JSON.parse(data)
                        if (fileout.key == "APPnamecfg") {//check if this file is a timetable backup file
                            config.data = fileout
                            config.save();
                            maininitalizer()
                        } else {
                            console.warn(filepath.filePaths[0] + ' is not a backup file')
                        }
                    }
                })
            }
        }).catch((err) => { alert('An error occured, ', err) })
    },
    selectlocation: async function () {//select location for configuration storage
        console.log('Select config location')

        var alt_location = main.get.alt_location() || false;

        if (alt_location != false) {
            var path = dialog.showOpenDialog(remote.getCurrentWindow(), { properties: ['createDirectory', 'openDirectory'], defaultPath: alt_location })
        } else {
            var path = dialog.showOpenDialog(remote.getCurrentWindow(), { properties: ['createDirectory', 'openDirectory'] })
        }

        await path.then((path) => {
            if (path.canceled == true) {//user canceled dialogue
                console.warn('user canceled file dialogue')
            } else {
                console.log('Alternate configuration path :', path.filePaths[0])

                main.set.alt_location(path.filePaths[0])

                if (fs.existsSync(path.filePaths[0] + "/APPnamecfg config.json")) {//config file already exist there
                    config.load()
                    maininitalizer()
                } else {//no config file exist there
                    config.save();
                }
            }
        }).catch((err) => {
            config.usedefault()
            alert('An error occured ', err.message)
        })
    },
    usedefault: function () { main.set.alt_location(false) },
}

let notify = {//notification function house
    reset: window.addEventListener('resize', () => { notify.clearall() }),
    new: function (title, body, hover_title, ifunction) {

        let notification = document.createElement("div")
        notification.classList = "notification"

        let notification_title = document.createElement("div")//title
        notification_title.classList = "title"
        notification_title.innerHTML = title

        let nbody = document.createElement("div")//body
        nbody.classList = "notifbody"
        nbody.innerHTML = body;

        if (hover_title != undefined) {
            notification.title = hover_title
        } else {
            notification.title = 'click to dismiss'
        }

        notification.appendChild(notification_title)
        notification.appendChild(nbody)
        document.body.appendChild(notification)

        if (typeof (ifunction) == 'function') { //imbedded function
            notification.addEventListener('click', ifunction);
            //Close button
            let xbutton = document.createElement('div')
            xbutton.setAttribute('class', 'x-button')
            notification.appendChild(xbutton)
            xbutton.title = 'click to dismiss';
            xbutton.addEventListener('click', function (e) { removethis(e, notification) })
        } else {
            notification.addEventListener('click', function (e) { removethis(e, notification) })
        }

        //Timing effects
        setTimeout(() => {
            notification.style.transform = 'translateX(0)'
            notify.shove()
        }, 50);

        setTimeout(() => { notification.style.opacity = '0.0' }, 10000); //dissapear

        setTimeout(() => { try { document.body.removeChild(notification) } catch (err) { console.warn(err) } }, 11000); //remove from document

        function removethis(e, rnotification) {
            e.stopImmediatePropagation();
            rnotification.style.transform = 'translateX(22rem)';
            setTimeout(() => { rnotification.style.opacity = '0.0'; }, 100)
            setTimeout(() => { try { document.body.removeChild(notification) } catch (err) { console.warn(err) } }, 1000)
        }

    },
    shove: function () {
        var notifications = document.querySelectorAll(".notification")
        var reverse = notifications.length - 1;
        for (let i in notifications) {
            notifications[i].style.transform = 'translateY(' + -reverse * 9 + 'rem)';//9 rem., height of notification
            reverse--;//get it, because oposite
        }
    },
    clearall: function () {
        document.querySelectorAll(".notification").forEach((notification) => {
            try {
                notification.style.opacity = '0.0';
                notification.style.transform = 'translate(0,0)'
            } catch (err) {
                console.warn(err)
            }
        })
    }
}
