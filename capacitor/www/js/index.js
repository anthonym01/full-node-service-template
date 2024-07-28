const { Browser, App, Camera, Toast, Storage } = Capacitor.Plugins;

const remote_host = 'localhost:1999';//a host

App.addListener('appStateChange', ({ isActive }) => {// app state is changed, usually sent to the background or suspended
    console.warn('App state changed. Is active: ', isActive);
});

App.addListener('backButton', () => {//back button on android
    event.preventDefault()
    console.warn('back button pressed')
    Toast
});

window.addEventListener('load', function () {

    try {
        config.load()
    } catch (err) {
        console.warn('Something bad happened: ', err)
    } finally {

    }

})

let config = {
    data: {//Loacal app data

    },
    save: async function () {//Save the config file
        console.warn('Configuration is being saved')
        Storage.set({ key: 'basicb', value: JSON.stringify(config.data) });
        console.table(config.data)
    },
    load: async function () {//Load the config file
        console.warn('Configuration is being loaded')
        let fromkey = await Storage.get({ key: 'basicb' })
        console.log('Loaded: ', fromkey)
        if (fromkey.value != null) {
            config.data = JSON.parse(fromkey.value);
            console.table(config.data)
        } else {
            console.warn('configuration loaded is empty')
        }

    },
    delete: function () {//Does not delete the file itself. Just sets it to empty
        Storage.remove({ key: 'basicb' });
        console.log('config deleted')
        console.table(config.data)
    }
}

let utility = {//Some usefull things
    properties: {
        exit: false,
        first_start: true,
        current_list: null,
    },
    exit_strategy: function () {//Heres how to string things togther to make something usefull
        console.warn('Exit strategy triggered')
        if (utility.properties.exit == true) {
            App.exitApp()
        } else {
            utility.properties.exit = true;
            Toast.show({ text: 'Press back button again to exit' });
            setTimeout(() => { utility.properties.exit = false }, 2000)
        }
    },
    /*  Push text to the keyboard   */
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
    /*  Produce Random numbers  */
    rand: {
        HEX: function () { return '#' + Math.floor(Math.random() * 16777215).toString(16) /* hex color code */ },
        RGB: function () { return { RED: this.number(255, 0), GREEN: this.number(255, 0), BLUE: this.number(255, 0) } /* object with RGB color code */ },
        HSL: function () { return { HUE: this.number(360, 0), SATURATION: this.number(100, 0) + '%', LIGHTENESS: this.number(100, 1) + '%' }/* HSL color code */ },
        number(max, min) { return Math.floor(Math.random() * (max - min + 1)) + min /* Random number*/ }
    },
}

async function request(what) {//make a request to server for data

    try {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {//wait for and handle response
            if (this.readyState == 4 && this.status == 200) {
                console.log('Server replied with: ', this.responseText, ' In response: ', this.response)
                return this.responseText
            }
        };

        xhttp.open("GET", remote_host + '/' + what, true);//get request
        xhttp.send();
    } catch (err) {
        console.warn('xhttp request failed ', err);
    }

}

async function post(what, where) {//post data to server
    var xhttp = new XMLHttpRequest(remote_host)

    xhttp.onreadystatechange = function () {//wait for and handle response
        if (this.readyState == 4 && this.status == 200) {
            console.log('Server replied with: ', this.responseText, ' In response: ', this.response)
        }
    };

    xhttp.open("POST", remote_host + '/' + where, true);
    xhttp.send(JSON.stringify(what));
}

async function open_link(link) { await Browser.open({ url: link }); }
