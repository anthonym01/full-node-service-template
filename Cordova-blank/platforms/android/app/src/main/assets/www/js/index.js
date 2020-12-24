
var app = {// Application Constructor
    initialize: function () {// deviceready Event Handler
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false)
        document.addEventListener("backbutton", this.onBackKeyDown, false)
        document.addEventListener("pause", this.onPause, false)
        document.addEventListener("resume", this.onResume, false)
        document.addEventListener("menubutton", this.onMenu, false)
    },
    onDeviceReady: function () {
        //this.receivedEvent('deviceready')
        console.log('Device is Ready...')
        maininitalizer();
    },
    onBackKeyDown: function () {
        console.warn('"Back button" event triggered')
        back();
    },
    onPause: function () {
        console.warn('"pause" event triggered')
        config.save()
    },
    onResume: function () {
        console.warn('"Resume" event triggered')
    },
    onMenu: function () {
        console.warn('"Menu button" event triggered')
    },
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id)
        var listeningElement = parentElement.querySelector('.listening')
        var receivedElement = parentElement.querySelector('.received')

        listeningElement.setAttribute('style', 'display:none;')
        receivedElement.setAttribute('style', 'display:block;')

        console.log('Received Event: ' + id)
    },
}; app.initialize()

function maininitalizer() {//Runs after 'Device ready'

    config.initialize();//Initalize configuration management
    toast('App is loaded')
}

let config = {
    data: {//Loacal app data
        key: "APPname_cfg",
        usecount: 0,
        last_view: null,
        animation: true,
        theme: "dark",
        accent_color: -1,
    },
    initialize: function () {//starts up the config manager
        console.warn('Config handler is initalized')
        if (localStorage.getItem("APPname_cfg")) {
            this.load()
        } else {
            this.validate()
        }
    },
    save: async function () {//Save the config file
        console.warn('Configuration is being saved')
        localStorage.setItem("APPname_cfg", JSON.stringify(config.data))
        console.table(config.data)
    },
    load: function () {//Load the config file
        console.warn('Configuration is being loaded')
        config.data = JSON.parse(localStorage.getItem("APPname_cfg"))
        console.table(config.data)
        this.validate()
    },
    validate: function () {//validate configuration file
        console.warn('Config is being validated')
        var configisvalid = true

        if (typeof (config.data.usecount) == 'undefined') {
            config.data.usecount = 1
            configisvalid = false
            console.log('"usecount" did not exist and was set to default')
        }

        if (typeof (config.data.last_view) == 'undefined') {
            config.data.last_view = null;
            configisvalid = false
            console.log('"last_view" did not exist and was set to default')
        }

        if (typeof (config.data.theme) == 'undefined') {
            config.data.theme = "dark";
            configisvalid = false
            console.log('"theme" did not exist and was set to default')
        }

        if (typeof (config.data.accent_color) == 'undefined') {
            config.data.accent_color = 210;
            configisvalid = false
            console.log('"accent_color" did not exist and was set to default')
        }

        if (typeof (config.data.animation) == 'undefined') {
            config.data.animation = true;
            configisvalid = false
            console.log('"animation" did not exist and was set to default')
        }

        if (!configisvalid) {
            console.log('config was found to be invalid and will be overwritten')
            this.save()//Save new confog because old config is no longer valid
        } else { console.log('config was found to be valid') }
    },
    delete: function () {//Does not delete the file itself. Just sets it to empty
        localStorage.clear("APPname_cfg")
        console.log('config deleted: ')
        console.table(config.data)
        this.validate()
    }
}

let properties = {
    exit: false,
    first_start: true,
}

async function back() {

    exit_strategy();

}

function exit_strategy() {//Heres how to string things togther to make something usefull
    console.warn('Exit strategy triggered')
    if (properties.exit == true) {
        close()
    } else {
        properties.exit = true;
        toast("Press back button again to exit", 2000)
        setTimeout(() => { properties.exit = false }, 2000)
    }
}

function close() {// Close the app 
    console.trace('App closure triggered via')
    if (navigator.app) {
        navigator.app.exitApp()
    } else if (navigator.device) {
        navigator.device.exitApp()
    } else {
        window.close()
    }
}

async function toast(text, durration_in_ms, position_top_right_left_bottom, offset_in_px) {//Produce toast messages
    if (position_top_right_left_bottom == undefined) { position_top_right_left_bottom = 'bottom' }//default the position
    if (durration_in_ms == undefined) { durration_in_ms = 4000 }//default the duration
    if (offset_in_px == undefined) { offset_in_px = -160 }//default the offset
    window.plugins.toast.showWithOptions({ message: text, duration: durration_in_ms, position: position_top_right_left_bottom, addPixelsY: offset_in_px })
}

async function clipboard(textpush) {//Wack text to clipboard
    copyText.toString()
    var temptxtbox = document.createElement("input")
    document.body.appendChild(temptxtbox)
    temptxtbox.setAttribute("id", "temp_copy")
    document.getElementById("temp_copy").value = copyText
    temptxtbox.select()
    document.execCommand("copy")
    document.body.removeChild(temptxtbox)
}
