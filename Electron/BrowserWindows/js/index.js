const main = require('electron').remote.require('./main');//acess export functions in main
const { dialog, Menu, MenuItem, systemPreferences, nativeTheme } = require('electron').remote;//Acess to electron dependencies
var fs = require('fs');//file system

window.addEventListener('load', function () {//window loads
    console.warn('Running from:', process.resourcesPath)
    console.log('System preference accent color: ', systemPreferences.getAccentColor())
    console.log('System preference Dark mode: ', nativeTheme.shouldUseDarkColors)
    console.log('System preference Anime settings: ', systemPreferences.getAnimationSettings().shouldRenderRichAnimation)

    window_menu()
    //textboxmenu()
    if (localStorage.getItem("APPnamecfg")) {//check if storage has the item
        config.load()
    } else {
        config.validate()
    }
    maininitalizer()
})

function maininitalizer() {//Used to start re-startable app functions

}

function window_menu() {//window menu
    //build menu
    const menu_body = new Menu()
    menu_body.append(new MenuItem({
        label: 'Restart application', click() {
            maininitalizer()
        }
    }))
    menu_body.append(new MenuItem({ type: 'separator' }))
    menu_body.append(new MenuItem({
        label: 'Contact developer', click() {
            shell.openExternal('https://anthonym01.github.io/Portfolio/?contact=me')
        }
    }))
    menu_body.append(new MenuItem({ role: 'toggledevtools' }))

    //attach menu to window
    window.addEventListener('contextmenu', (event) => {//opens menu on auxilery click
        event.preventDefault()
        menu_body.popup({ window: require('electron').remote.getCurrentWindow() })//popup menu
    }, false)
}

function textboxmenu() {//text box menus
    //construct meno
    const text_box_menu = new Menu.buildFromTemplate([
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
        { role: 'seperator' },
        { role: 'undo' },
        { role: 'redo' },
    ])

    //add events to text boxes
    textbox.addEventListener('contextmenu', (event) => popupmenu, false)

    //Popup the menu in this window
    function popupmenu(event) {
        event.preventDefault()
        event.stopPropagation()
        text_box_menu.popup({ window: require('electron').remote.getCurrentWindow() })
    }
}

let config = {//Application configuration object
    baseconfig: {//base configuration
        use_alt_storage: false,
        alt_location: "",
    },
    data: {//application data
        key: "APPnamecfg",
        /*usecount: 0,*/
    },
    save: async function () {//Save the config file
        console.table('Configuration is being saved', config.data)

        ToStorageAPI();//save to application storage reguardless incase the file gets removed by the user, because users are kinda dumb
        if (config.baseconfig.use_alt_storage == true) {//save to alternate storage location
            ToFileSystem();
        }

        function ToFileSystem() {//save config to directory defined by the user
            console.log('saving to File system: ', config.baseconfig.alt_location.toString())
            fs.writeFile(config.baseconfig.alt_location.toString() + "/APPnamecfg config.json", JSON.stringify(config.data), 'utf8', (err) => {//write to file
                if (err) {//error
                    alert("An error occurred creating the file, please select a new location to save app data " + err.message)
                    config.selectlocation();
                } else {//sucessfull
                    console.log('config saved to: ', config.baseconfig.alt_location.toString())
                }
            })
        }

        function ToStorageAPI() {//Html5 storage API
            console.log('config saved to application storage')
            localStorage.setItem("APPnamecfg", JSON.stringify(config.data))
        }
    },
    load: function () {//Load the config file
        console.warn('Configuration is being loaded')

        if (localStorage.getItem("APPnamecfg_baseconfig")) {//load base config
            config.baseconfig = JSON.parse(localStorage.getItem("APPnamecfg_baseconfig"))
        } else {
            //first startup
            localStorage.setItem("APPnamecfg_baseconfig", JSON.stringify(config.baseconfig))
        }

        if (config.baseconfig.use_alt_storage == true) {//Load from alt location
            //load from alternate storage location
            if (fs.existsSync(config.baseconfig.alt_location.toString() + "/APPnamecfg config.json")) {//Directory exists
                var fileout = fs.readFileSync(config.baseconfig.alt_location.toString() + "/APPnamecfg config.json", { encoding: 'utf8' })//Read from file with charset utf8
                console.warn('config Loaded from: ', config.baseconfig.alt_location.toString(), 'Data from fs read operation: ', fileout)
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
                alert("file does not exist, was moved, deleted or is otherwise inaccesible, please select a new location to save app data ")
                config.selectlocation();
            }
        } else {//load from application storage
            config.data = JSON.parse(localStorage.getItem("APPnamecfg"))
            console.log('config Loaded from application storage')
        }

        console.table(config.data)
        this.validate()
    },
    validate: function () {//validate configuration
        console.warn('Config is being validated')
        var configisvalid = true

        /*if (typeof (config.data.usecount) == 'undefined') {
            config.data.usecount = 1
            configisvalid = false
            console.log('"usecount" did not exist and was set to default')
        }*/

        if (!configisvalid) {
            console.log('config was found to be invalid and will be overwritten')
            this.save()//Save new confog because old config is no longer valid
        } else { console.log('config was found to be valid') }

    },
    delete: function () {//Wjipe stowage
        localStorage.clear("APPnamecfg")//yeet storage key
        config.usedefault();//use default location
        console.log('config deleted: ')
        console.table(config.data)
        this.validate()
    },
    backup: async function () {//backup configuration to a file
        console.warn('Configuration backup initiated')

        var date = new Date();
        var filepath = dialog.showSaveDialog({//electron file save dialogue
            defaultPath: "APPnamecfg backup " + Number(date.getMonth() + 1) + " - " + date.getDay() + " - " + date.getFullYear() + ".json",
            buttonLabel: "Save"
        });

        await filepath.then((filepath) => {//resolve filepath promise
            console.log(filepath)
            if (filepath.canceled == true) {//the file save dialogue was canceled my the user
                console.warn('The file dialogue was canceled by the user')
            } else {
                fs.writeFile(filepath.filePath, JSON.stringify(config.data), 'utf8', (err) => {//write config to file as json
                    if (err) {
                        alert("An error occurred creating the file " + err.message)
                    } else {
                        console.log("The file has been successfully saved to: ", filepath.filePath);
                    }
                })
            }
        }).catch((err) => {//catch error
            alert('An error occured ', err.message);
        })
    },
    restore: async function () {//restore configuration from a file
        console.warn('Configuration restoration initiated')

        dialog.showOpenDialog({
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
        }).catch((err) => {
            alert('An error occured, ', err)
        })
    },
    selectlocation: async function () {//select location for configuration storage
        console.log('Select config location')
        if (config.baseconfig.alt_location != undefined) {
            var path = dialog.showOpenDialog({ properties: ['createDirectory', 'openDirectory'], defaultPath: config.baseconfig.alt_location.toString() })
        } else {
            var path = dialog.showOpenDialog({ properties: ['createDirectory', 'openDirectory'], defaultPath: null })
        }

        await path.then((path) => {
            if (path.canceled == true) {//user canceled dialogue
                config.usedefault()
            } else {
                console.warn('Alternate configuration path :', path.filePaths[0])

                config.baseconfig.use_alt_storage = true
                config.baseconfig.alt_location = path.filePaths[0]
                localStorage.setItem("APPnamecfg_baseconfig", JSON.stringify(config.baseconfig))//save base config

                if (fs.existsSync(config.baseconfig.alt_location.toString() + "/APPnamecfg config.json")) {//config file already exist there
                    config.load()
                } else {//no config file exist there
                    config.save();
                }
            }
        }).catch((err) => {
            config.usedefault()
            alert('An error occured ', err.message)
        })
    },
    usedefault: function () {//use default storage location
        config.baseconfig.use_alt_storage = false
        localStorage.setItem("APPnamecfg_baseconfig", JSON.stringify(config.baseconfig))//save base config
    },
}

let utility = {//Misculanious utilites
    get_url_variables: function (url) {
        //Yoinked from https://gomakethings.com/getting-all-query-string-values-from-a-url-with-vanilla-js/
        var params = {};
        var parser = document.createElement('a');
        parser.href = url;
        var query = parser.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        return params;
        //returns Object { "": "undefined" } if empty
        //Call with getParams(window.location.href);
    },
    clipboard: async function (textpush) {
        copyText.toString()
        var temptxtbox = document.createElement("input")
        document.body.appendChild(temptxtbox)
        temptxtbox.setAttribute("id", "temp_copy")
        document.getElementById("temp_copy").value = textpush
        temptxtbox.select()
        document.execCommand("copy")
        document.body.removeChild(temptxtbox)
    },
    rand: {//'Random' numbers
        HEX: function () { return '#' + Math.floor(Math.random() * 16777215).toString(16) /* hex color code */ },
        RGB: function () { return { RED: this.number(255, 0), GREEN: this.number(255, 0), BLUE: this.number(255, 0) } /* object with RGB color code */ },
        HSL: function () { return { HUE: this.number(360, 0), SATURATION: this.number(100, 0) + '%', LIGHTENESS: this.number(100, 1) + '%' }/* HSL color code */ },
        number(max, min) { return Math.floor(Math.random() * (max - min + 1)) + min /* Random number*/ }
    },
    HEXtoHSL: function (hex_put) {//Convert  System preference color hex to a form my brain can can use
        var redhex = hex_put.slice(0, 2);
        var greenhex = hex_put.slice(2, 4);
        var bluehex = hex_put.slice(4, 6);
        console.log(hex_put, ' : ', redhex, ' : ', greenhex, ' : ', bluehex)
        if (redhex == 0) { redhex = '00' }
        if (greenhex == 0) { greenhex = '00' }
        if (bluehex == 0) { bluehex = '00' }
        var r = parseInt(redhex, 16)
        var g = parseInt(greenhex, 16)
        var b = parseInt(bluehex, 16)
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }
        return { h, s, l, r, g, b };
    },
}