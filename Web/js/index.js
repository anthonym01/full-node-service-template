window.addEventListener('load', function () {
    console.warn("Welcome fellow power user OwO")

})

let config = {
    data: {//Loacal app data
        key: "APPname_cfg",
        usecount: 0,
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

let utility = {//Misculanious utilites
    get_url_variables: function (url) {
        //Yoinked from
        //https://gomakethings.com/getting-all-query-string-values-from-a-url-with-vanilla-js/
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
        //Call with var this_url = getParams(window.location.href);
    },
    close: function () {//Close the app
        config.save()
        window.close()
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
    rand: {
        HEX: function () { return '#' + Math.floor(Math.random() * 16777215).toString(16) /* hex color code */ },
        RGB: function () { return { RED: this.number(255, 0), GREEN: this.number(255, 0), BLUE: this.number(255, 0) } /* object with RGB color code */ },
        HSL: function () { return { HUE: this.number(360, 0), SATURATION: this.number(100, 0) + '%', LIGHTENESS: this.number(100, 1) + '%' }/* HSL color code */ },
        number(max, min) { return Math.floor(Math.random() * (max - min + 1)) + min /* Random number*/ }
    },
}