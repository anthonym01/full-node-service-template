const { ipcRenderer } = require('electron');
const my_website = 'https://anthonym01.github.io/Portfolio/?contact=me';//My website
const remote_host = 'host';

window.addEventListener('load', function () {//window loads

    config.load()
    maininitalizer()

})

function maininitalizer() {//Used to start re-startable app functions
    console.log('main initalizer')
    ipcRenderer.send('mainwindow_channel', 'Initalized')//Send window reinitalized to main

}

let config = {
    data: {//application data
        key: "APPnamecfg",
    },
    save: async function () {//Save the config file
        try {
            localStorage.setItem("APPnamecfg", JSON.stringify(config.data));
            console.table('Configuration saved', config.data)
        } catch (error) {
            console.error(error)
        }
    },
    load: function () {//Load the config file
        console.warn('Configuration is being loaded')
        config.data = JSON.parse(localStorage.getItem("APPnamecfg"))
        console.log('config Loaded from application storage')
        console.table(config.data)
    },
    delete: function () {//Wjipe stowage
        localStorage.clear("APPnamecfg")//yeet storage key
        config.usedefault();//use default location
        console.log('config deleted: ')
        console.table(config.data)
    },
}