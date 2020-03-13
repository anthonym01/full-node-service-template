const main = require('electron').remote.require('./main');//acess export functions in main
const { dialog } = require('electron').remote;//Initalize Electon dependencies
const fs = require('fs');//Initalize file system
const fse = require('fs-extra');//Initalize file system extra

window.addEventListener('load', function () {//window loads
    if (typeof (require) == 'undefined') {//initialize node modules
        console.error('Running in Browser')
    } else {
        console.log('Running in Node')
    }

    config.initialize()

});

let config = {/* Handles configuration */
    data: {
        key: "APPname_cfg",
        usecount: 0,
    },
    baseconfig: {
        use_alt_storage: false,
        alt_location: "",
    },
    properties: {/* Properties of loaded app */

    },
    initialize: function () {
        console.warn('Config handler is initalized')
        if (localStorage.getItem("APPname_cfg")) {
            this.load()
        } else {
            this.validate()
        }
    },
    save: function () {//Save the config file
        console.warn('Configuration is being saved')
        if (this.baseconfig.use_alt_storage == true) {//save to alternate storage location
            fse.ensureDirSync(this.baseconfig.alt_location.toString())//endure the directory exists
            fs.writeFile(this.baseconfig.alt_location.toString() + "/APPname_cfgconfig.json", JSON.stringify(config.data), (err) => {//write to file
                if (err) {//error
                    alert("An error occurred creating the file " + err.message)
                } else {//sucessfull
                    console.log('config saved to: ' + this.baseconfig.alt_location.toString())
                }
            })
        }
        console.log('config saved to application storage')
        localStorage.setItem("APPname_cfg", JSON.stringify(this.data))//save to application storage reguardless incase the file gets removed by the user
        console.table(this.data)
    },
    load: function () {//Load the config file
        console.warn('Configuration is being loaded')

        if (localStorage.getItem("APPname_cfg_baseconfig")) {//load base config firt
            this.baseconfig = JSON.parse(localStorage.getItem("APPname_cfg_baseconfig"))
        } else {
            //first startup
            localStorage.setItem("APPname_cfg_baseconfig", JSON.stringify(this.baseconfig))
        }

        if (this.baseconfig.use_alt_storage == true) {
            //load from alternate storage location
            if (fs.existsSync(this.baseconfig.alt_location.toString() + "/APPname_cfgconfig.json")) {//Directory exists
                var fileout = fs.readFileSync(this.baseconfig.alt_location.toString() + "/APPname_cfgconfig.json", { encoding: 'utf8' })
                console.warn('config Loaded from: ', this.baseconfig.alt_location.toString(), 'Data from fs read operation: ', fileout)
                fileout = JSON.parse(fileout)
                if (fileout.key == "APPname_cfg") {//check if file has key
                    this.data = fileout;
                    console.warn('configuration applied from file')
                } else {
                    console.warn('The file is not a config file, internal configuration will be used')
                    this.data = JSON.parse(localStorage.getItem("APPname_cfg"))
                }
            } else {//file does not exist, was moved, deleted or is inaccesible
                this.data = JSON.parse(localStorage.getItem("APPname_cfg"))
                this.save()//save to recreate the file
            }
        } else {//load from application storage
            this.data = JSON.parse(localStorage.getItem("APPname_cfg"))
            console.log('config Loaded from application storage')
        }

        console.table(this.data)
        this.validate()
    },
    validate: function () {//validate configuration file
        console.warn('Config is being validated')
        var configisvalid = true
        if (typeof (this.data.usecount) != 'undefined') {
            if (this.data.usecountt == undefined || this.data.usecount < 0) {
                this.data.usecount = 1
                configisvalid = false
                console.log('"usecount" was found to be invalid and was set to default')
            }
        } else {
            this.data.usecount = 1
            configisvalid = false
            console.log('"usecount" did not exist and was set to default')
        }

        if (!configisvalid) {
            console.log('config was found to be invalid and will be overwritten')
            this.save()//Save new confog because old config is no longer valid
        } else { console.log('config was found to be valid') }
    },
    delete: function () {//Does not delete the file itself. Just sets it to empty
        localStorage.clear("APPname_cfg")
        console.log('config deleted: ')
        console.table(this.data)
        this.validate()
    },
    backup: function () {//backup configuration to a file
        console.warn('Configuration backup initiated')
        var date = new Date();
        var filepath = dialog.showSaveDialog({ /*this path must be changed*/defaultPath: "APPname_cfg backup " + Number(date.getMonth() + 1) + " - " + date.getDay() + " - " + date.getFullYear() + ".json", buttonLabel: null });
        if (filepath == undefined) {//the file save dialogue was canceled my the user
            console.warn('The file dialogue was canceled by the user')
        } else {
            fs.writeFile(filepath, JSON.stringify(config.data), (err) => {
                if (err) {
                    alert("An error occurred creating the file " + err.message)
                } else {
                    console.log("The file has been successfully saved");
                }
            })
        }
    },
    restore: function () {//restore configuration from a file
        console.warn('Configuration restoration initiated')
        var filepath = dialog.showOpenDialog({ buttonLabel: "open" })
        if (filepath == undefined) {
            console.log("No file selected");
        } else {
            fs.readFile(filepath[0], 'utf-8', (err, data) => {
                if (err) { alert("An error ocurred reading the file :" + err.message) }
                console.log("The file content is : " + data);
                var fileout = JSON.parse(data)
                if (fileout.key == "APPname_cfg") {//check if this file is a timetable backup file
                    config.data = fileout
                    config.save();
                    setTimeout(() => { location.reload() }, 2000)
                } else {
                    console.warn(filepath[0] + 'This is not a backup file')
                }

            })
        }
    },
    selectlocation: function () {//select location for configuration storage
        var path = dialog.showOpenDialog({ properties: ['createDirectory', 'openDirectory'], defaultPath: config.baseconfig.alt_location.toString() })
        console.warn('Alternate configuration path :', path[0])
        this.baseconfig.use_alt_storage = true
        this.baseconfig.alt_location = path[0]
        localStorage.setItem("APPname_cfg_baseconfig", JSON.stringify(config.baseconfig))//save base config
        fse.ensureFileSync(baseconfig.alt_location.toString() + "/APPname_cfgconfig.json")//ensure the file exists, if any
        var fileout = fs.readFileSync(config.baseconfig.alt_location.toString() + "/APPname_cfgconfig.json", { encoding: 'utf8' });//will cast error if no file, this is fine fs will catch and deal with it automatically
        fileout = JSON.parse(fileout)
        if (fileout != undefined) {
            if (fileout.key == "APPname_cfg") {
                console.warn('A file exists here, prompt the user on what to keep, default is currently whats in the file')
                config.data = fileout
                config.save()
            } else {
                console.warn('No file exists here, config from this app is used')
                config.save()//to create the file
            }
        } else {
            console.warn('No file exists here, config from this app is used')
            config.save()//to create the file
        }

    },
    usedefault: function () {//use default storage location
        config.baseconfig.use_alt_storage = false
        localStorage.setItem("TT01_baseconfig", JSON.stringify(config.baseconfig))//save base config
    },
}

let utility = {//Misculanious utilites
    closeapp: function () {//Close the app
        config.save()
        window.close()
    },
    clipboard: function (textpush) {
        copyText.toString()
        var temptxtbox = document.createElement("input")
        document.body.appendChild(temptxtbox)
        temptxtbox.setAttribute("id", "temp_copy")
        document.getElementById("temp_copy").value = textpush
        temptxtbox.select()
        document.execCommand("copy")
        document.body.removeChild(temptxtbox)
    },
    rand: {
        HEX: function () { return '#' + Math.floor(Math.random() * 16777215).toString(16) /* hex color code */ },
        RGB: function () { return { RED: this.number(255, 0), GREEN: this.number(255, 0), BLUE: this.number(255, 0) } /* object with RGB color code */ },
        HSL: function () { return { HUE: this.number(360, 0), SATURATION: this.number(100, 0) + '%', LIGHTENESS: this.number(100, 1) + '%' }/* HSL color code */ },
        number(max, min) { return Math.floor(Math.random() * (max - min + 1)) + min /* Random number*/ }
    },
}