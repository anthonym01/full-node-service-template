
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
        toast('App is loaded');
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

let properties = {
    exit: false,
    first_start: true,
}

function back() {//back button

    exit_strategy();

}

function exit_strategy() {//Close the app
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