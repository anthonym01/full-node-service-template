window.addEventListener('load', function () {
    console.warn("Welcome fellow power user OwO")

})

let config = {
    key: "APPname_cfg",
    usecount: 0,
}


let config_handler = {/* Handles configuration */
    initialize: function () {
        console.warn('Config handler is initalized')
        if (localStorage.getItem("APPname_cfg")) {
            this.load()
        } else {
            this.validate()
        }
    },
    save: async function () {//Save the config file
        console.warn('Configuration is being saved')
        localStorage.setItem("APPname_cfg", JSON.stringify(config))
        console.table(config)
    },
    load: function () {//Load the config file
        console.warn('Configuration is being loaded')
        config = JSON.parse(localStorage.getItem("APPname_cfg"))
        console.table(config)
        this.validate()
    },
    validate: function () {//validate configuration file
        console.warn('Config is being validated')
        var configisvalid = true
        if (typeof (config.usecount) != 'undefined') {
            if (config.usecountt == undefined || config.usecount < 0) {
                config.usecount = 1
                configisvalid = false
                console.log('"usecount" was found to be invalid and was set to default')
            }
        } else {
            config.usecount = 1
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
        console.table(config)
        this.validate()
    }
}