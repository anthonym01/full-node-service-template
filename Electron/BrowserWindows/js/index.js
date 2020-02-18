
const { dialog } = require('electron').remote;
const fs = require('fs');

window.addEventListener('load', function () {//window loads
    if (typeof (require) == 'undefined') {//initialize node modules
        console.error('Running in Browser')
    } else {
        console.log('Running in Node')
    }

    if (localStorage.getItem("APPNAME_cfg")) {
        config.load()
    } else {
        config.validate()
    }

});

var config = {
    data: {
        key:"APPNAME_cfg",
        usecount: 0,
    },
    properties:{

    },
    save: function () {//Save the config file
        localStorage.setItem("APPNAME_cfg", JSON.stringify(config.data))
        console.log('config saved: ')
        console.table(config.data)
    },
    load: function () {//Load the config file into memory
        config.data = JSON.parse(localStorage.getItem("APPNAME_cfg"))
        console.log('config Loaded: ')
        console.table(config.data)
        this.validate()
    },
    validate: function () {//validate configuration file
        console.log('Config is being validated')
        var configisvalid = true
        if (typeof (this.data.usecount) != 'undefined') {
            if (this.data.usecount == undefined || this.data.usecount < 0) {
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
        localStorage.clear("APPNAME_cfg")
        console.log('config deleted: ')
        console.table(config.data)
        this.validate()
    },
    backup: function () {//backup configuration to file
        console.log('Configuration backup initiated')
        var date = new Date();
        var filepath = dialog.showSaveDialog({defaultPath:"APPNAME_cfg backup "+Number(date.getMonth()+1)+" - "+date.getDay()+" - "+date.getFullYear()+".json",buttonLabel:null});
        if (filepath == undefined) {//the file save dialogue was canceled my the user
            console.warn('The file dialogue was canceled by the user')
        } else {
            fs.writeFile(filepath, JSON.stringify(config.data), (error) => {
                if (error) {
                    alert("An error occurred creating the file " + err.message)
                } else {
                    console.log("The file has been successfully saved");
                }
            })
        }
    },
    restore: function () {//restore configuration from file
        console.log('Configuration backup initiated')
        var filepath = dialog.showOpenDialog({ buttonLabel: "open" })
        if (filepath == undefined) {
            console.log("No file selected");
        } else {
            fs.readFile(filepath[0], 'utf-8', (err, data) => {
                if (err) { alert("An error ocurred reading the file :" + err.message) }
                console.log("The file content is : " + data);
                var fileout = JSON.parse(data)
                if(fileout.key == "APPNAME_cfg"){//check if this file is a timetable backup file
                    config.data = fileout
                    config.save();
                    setTimeout(()=>{location.reload()},2000)
                }else{
                    console.warn(filepath[0]+'This is not a backup file')
                }
                
            })
        }
    }
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
        document.getElementById("temp_copy").value = copyText
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