var app = {// Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("backbutton", this.onBackKeyDown, false);
        document.addEventListener("pause", this.onPause, false);
        document.addEventListener("resume", this.onResume, false);
        document.addEventListener("menubutton", this.onMenu, false);
    },// deviceready Event Handler
    onDeviceReady: function() {//device ready event
        this.receivedEvent('deviceready');
        console.log('Device is Ready...');
    },
    onBackKeyDown:function() {//Back button pressed event
        console.warn('"Back button" event triggered');
        utility.exit_strategy();//Pre built back function
    },
    onPause:function(){//application pause event
        console.warn('"pause" event triggered');
        config.save();
    },
    onResume:function(){
        console.warn('"Resume" event triggered');
    },
    onMenu:function(){
        console.warn('"Menu button" event triggered');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
};app.initialize();

window.addEventListener('load',function(){//applictaion needs to be constructed first
    if(localStorage.getItem("APPNAME_cfg")){
        config.load();
    }else{
        config.validate();
    }
    
    if(typeof(device)!='undefined'){//check device mode
        if(device.platform=='Android'||'iOS'){//mobile
            console.warn('Running on a mobile platform');
        }else{
            console.warn('Running on a Desktop platform');
        }
    }else{
        console.error('Device plugin broke');
    }

});

var config = {//Configuration handler
    data:{
        
    },
    properties:{
        exit:false
    },
    save:function(){//Save the config file
        localStorage.setItem("APPNAME_cfg",JSON.stringify(config.data));
        console.log('config saved: ');
        console.table(config.data);
    },
    load:function(){//Load the config file into memory
        config.data=JSON.parse(localStorage.getItem("APPNAME_cfg"));
        console.log('config Loaded: ');
        console.table(config.data);
        this.validate();
    },
    validate:function(){//validate configuration file
        console.log('Config is being validated');
        var configisvalid = true;
        


        if(!configisvalid){
            console.warn('config was found to be invalid and will be overwritten');
            this.save();//Save new confog because old config is no longer valid
        }else{console.log('config was found to be valid');}
    },
    delete:function(){//Does not delete the file itself. Just sets it to empty
        localStorage.clear("APPNAME_cfg");
        console.log('config deleted: ');
        console.table(config.data);
        this.validate();
    }
}

let utility = {//Some usefull things
    exit_strategy:function(){//Heres how to string things togther to make something usefull
        console.warn('Exit strategy triggered');
        if(config.properties.exit){
            utility.close();
        }else{
            config.properties.exit = true;
            utility.toast("Press back button again to exit",2000);
            setTimeout(()=>{
                config.properties.exit = false;
            },2000);
        }
    },
    /*  Close the app   */
    close:function(){
        console.trace('App closure triggered via');
        config.save();
        if (navigator.app) {
            navigator.app.exitApp();
        } else if (navigator.device) {
            navigator.device.exitApp();
        } else {
            window.close();
        }
    },
    /*  Produce toast messages    */
    toast:function(text,durration_in_ms,position_top_right_left_bottom,offset_in_px){
        if(position_top_right_left_bottom==undefined){position_top_right_left_bottom='bottom'}//default the position
        if(durration_in_ms==undefined){durration_in_ms=4000}//default the duration
        if(offset_in_px==undefined){offset_in_px=-160}//default the offset
        window.plugins.toast.showWithOptions({message: text, duration: durration_in_ms, position: position_top_right_left_bottom, addPixelsY: offset_in_px},);
    },
    /*  Push text to the keyboard   */
    clipboard:function(textpush) {
        copyText.toString(); //Makes it a string so the clipboard will accept it
        var temptxtbox = document.createElement("input"); //creates an 'input' element and assigns it to 'temptxtbox'
        document.body.appendChild(temptxtbox); //Puts the input element into the document
        temptxtbox.setAttribute("id", "temp_copy"); //Assigns an id to the input element
        document.getElementById("temp_copy").value = copyText; //Puts the txt u want to copy into the input element
        temptxtbox.select(); //Makes the curser select the text that's in the input element
        document.execCommand("copy"); //Commands the document to copy the selected text
        document.body.removeChild(temptxtbox); //Removes the input element from the document
    },
    /*  Produce Random numbers  */
    rand:{
        HEX:function(){return '#'+Math.floor(Math.random()*16777215).toString(16) /* hex color code */ },
        RGB:function(){return { RED:this.number(255,0), GREEN:this.number(255,0), BLUE:this.number(255,0)} /* object with RGB color code */ },
        HSL:function(){return  { HUE:this.number(360,0), SATURATION:this.number(100,0)+'%', LIGHTENESS:this.number(100,1)+'%' }/* HSL color code */},
        number(max,min){return Math.floor(Math.random() * (max - min + 1) ) + min /* Random number*/}
    },
}