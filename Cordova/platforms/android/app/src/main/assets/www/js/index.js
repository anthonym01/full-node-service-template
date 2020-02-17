var app = {// Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};app.initialize();

/*  Add your crap here  */

const configlocation = "APPNAME_cfg";//not strict, can be anything. Think of it as a file name/path

window.addEventListener('load',function(){//window loads
    if(localStorage.getItem(configlocation))
        {
            loadconfig();
            config.usecount++;
        }
        else
        {
            saveconfig();
            loadconfig();
            config.usecount=1;
        }
    saveconfig();
});

var config={
    usecount:0,
}
function saveconfig(){
    localStorage.setItem(configlocation,JSON.stringify(config));
    console.log('config saved: ',config);
}
function loadconfig(){
    config=JSON.parse(localStorage.getItem(configlocation));
    console.log('config Loaded: ',config);
}
function deleteconfig(){
    localStorage.clear(configlocation);
    console.log('config deleted: ',config);
}