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
        Ui.navigate.back();
    },
    onPause: function () {
        console.warn('"pause" event triggered')
        config.save()
    },
    onResume: function () {
        console.warn('"Resume" event triggered')
        if (config.data.theme == "devicebased") { Ui.setting.set_theme() }
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

    if (typeof (device) != 'undefined') {//check device mode
        if (device.platform == 'Android' || 'iOS') {//mobile
            console.warn('Running on a mobile platform')
        } else {
            console.warn('Running on a Desktop platform')
        }
    } else {
        console.error('Device plugin broke')
    }

    config.initialize();//Initalize configuration management
    utility.size_check()
    Ui.initialize()
    setTimeout(() => {
        navigator.splashscreen.hide();//hide splashscreen
        window.addEventListener('resize', function () { utility.size_check() })
        utility.properties.first_start = false;
    }, 300);
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

let Ui = {
    initialize: function () {//start ui logic
        console.warn('Ui initalize')
        this.navigate.lastmain_view()
        this.setting.animation.setpostition()
        this.setting.set_theme()

        document.getElementById('view_1_btn').addEventListener('click', Ui.navigate.view_1)
        document.getElementById('view_2_btn').addEventListener('click', Ui.navigate.view_2)
        document.getElementById('setting_btn').addEventListener('click', Ui.navigate.setting)
        document.getElementById('Animations_btn').addEventListener('click', Ui.setting.animation.flip)

        document.getElementById('set_device').addEventListener('click', function () {
            config.data.theme = "devicebased"
            config.save();
            Ui.setting.set_theme()
            utility.toast('following device theme')
        })
        document.getElementById('set_dark').addEventListener('click', function () {
            config.data.theme = "dark"
            config.save();
            Ui.setting.set_theme()
            utility.toast('Dark theme')
        })
        document.getElementById('set_light').addEventListener('click', function () {
            config.data.theme = "light"
            config.save();
            Ui.setting.set_theme()
            utility.toast('Light theme')
        })
        document.getElementById('hue-1-selec').addEventListener('click', function () {
            hue_selec(-1)
            document.getElementById('hue-1-selec').classList = "accent_blob_active"
            console.log('hue change -1')
        })
        document.getElementById('hue0-selec').addEventListener('click', function () {
            hue_selec(0)
            document.getElementById('hue0-selec').classList = "accent_blob_active"
            console.log('%chue change 0', "color: hsl(0,100%,50%)")
        })
        document.getElementById('hue30-selec').addEventListener('click', function () {
            hue_selec(30)
            document.getElementById('hue30-selec').classList = "accent_blob_active"
            console.log('%chue change 30', "color: hsl(30,100%,50%)")
        })
        document.getElementById('hue60-selec').addEventListener('click', function () {
            hue_selec(60)
            document.getElementById('hue60-selec').classList = "accent_blob_active"
            console.log('%chue change 60', "color: hsl(60,100%,50%)")
        })
        document.getElementById('hue90-selec').addEventListener('click', function () {
            hue_selec(90)
            document.getElementById('hue90-selec').classList = "accent_blob_active"
            console.log('%chue change 90', "color: hsl(90,100%,50%)")
        })
        document.getElementById('hue120-selec').addEventListener('click', function () {
            hue_selec(120)
            document.getElementById('hue120-selec').classList = "accent_blob_active"
            console.log('%chue change 120', "color: hsl(120,100%,50%)")
        })
        document.getElementById('hue150-selec').addEventListener('click', function () {
            hue_selec(150)
            document.getElementById('hue150-selec').classList = "accent_blob_active"
            console.log('%chue change 150', "color: hsl(150,100%,50%)")
        })
        document.getElementById('hue180-selec').addEventListener('click', function () {
            hue_selec(180)
            document.getElementById('hue180-selec').classList = "accent_blob_active"
            console.log('%chue change 180', "color: hsl(180,100%,50%)")
        })
        document.getElementById('hue210-selec').addEventListener('click', function () {
            hue_selec(210)
            document.getElementById('hue210-selec').classList = "accent_blob_active"
            console.log('%chue change 210', "color: hsl(210,100%,50%)")
        })
        document.getElementById('hue240-selec').addEventListener('click', function () {
            hue_selec(240)
            document.getElementById('hue240-selec').classList = "accent_blob_active"
            console.log('%chue change 240', "color: hsl(240,100%,50%)")
        })
        document.getElementById('hue270-selec').addEventListener('click', function () {
            hue_selec(270)
            document.getElementById('hue270-selec').classList = "accent_blob_active"
            console.log('%chue change 270', "color: hsl(270,100%,50%)")
        })
        document.getElementById('hue300-selec').addEventListener('click', function () {
            hue_selec(300)
            document.getElementById('hue300-selec').classList = "accent_blob_active"
            console.log('%chue change 300', "color: hsl(300,100%,50%)")
        })
        document.getElementById('hue330-selec').addEventListener('click', function () {
            hue_selec(330)
            document.getElementById('hue330-selec').classList = "accent_blob_active"
            console.log('%chue change 330', "color: hsl(330,100%,50%)")
        })

        function hue_selec(hue) {
            document.getElementById('hue-1-selec').classList = "accent_blob"
            document.getElementById('hue0-selec').classList = "accent_blob"
            document.getElementById('hue30-selec').classList = "accent_blob"
            document.getElementById('hue60-selec').classList = "accent_blob"
            document.getElementById('hue90-selec').classList = "accent_blob"
            document.getElementById('hue120-selec').classList = "accent_blob"
            document.getElementById('hue150-selec').classList = "accent_blob"
            document.getElementById('hue180-selec').classList = "accent_blob"
            document.getElementById('hue210-selec').classList = "accent_blob"
            document.getElementById('hue240-selec').classList = "accent_blob"
            document.getElementById('hue270-selec').classList = "accent_blob"
            document.getElementById('hue300-selec').classList = "accent_blob"
            document.getElementById('hue330-selec').classList = "accent_blob"
            config.data.accent_color = hue;
            Ui.setting.set_theme();
            config.save();
        }
    },
    navigate: {//navigation
        back: async function () {
            if (document.getElementById('setting_view').style.display == "block") {
                Ui.navigate.lastmain_view();
            } else {
                utility.exit_strategy();
            }
        },
        lastmain_view: function () {
            switch (config.data.last_view) {//Set view to last view the user used, excluding settings
                case "view_2":
                    Ui.navigate.view_2()
                    break;
                case "view_1":
                    Ui.navigate.view_1()
                    break;
                default:
                    console.warn('Last view error, defaulting');
                    Ui.navigate.view_1()
            }
        },
        setting: function () {
            console.log('Naviagate settings')
            document.getElementById('view_1_btn').classList = "navbtn"
            document.getElementById('view_2_btn').classList = "navbtn"
            document.getElementById('setting_btn').classList = "navbtn_ative"
            document.getElementById('view_1').style.display = "none"
            document.getElementById('view_2').style.display = "none"
            document.getElementById('setting_view').style.display = "block"
        },
        view_1: function () {
            console.log('Naviagate inventory')
            document.getElementById('view_2_btn').classList = "navbtn"
            document.getElementById('view_1_btn').classList = "navbtn_ative"
            document.getElementById('setting_btn').classList = "navbtn"
            document.getElementById('view_1').style.display = "block"
            document.getElementById('view_2').style.display = "none"
            document.getElementById('setting_view').style.display = "none"
            config.data.last_view = "view_1"
        },
        view_2: function () {
            console.log('Naviagate accounts')
            document.getElementById('view_2_btn').classList = "navbtn_ative"
            document.getElementById('view_1_btn').classList = "navbtn"
            document.getElementById('setting_btn').classList = "navbtn"
            document.getElementById('view_1').style.display = "none"
            document.getElementById('view_2').style.display = "block"
            document.getElementById('setting_view').style.display = "none"
            config.data.last_view = "view_2"
        }
    },
    setting: {
        set_theme: function () {//determines which theme to use
            console.log('Set theme')

            cordova.plugins.ThemeDetection.isAvailable(//detect device theme and adjust accordingly
                function (success) {
                    console.log(success)
                    if (success.value == true) {//theme detection is availible
                        cordova.plugins.ThemeDetection.isDarkModeEnabled(
                            function (success) {//sucesfully detected a theme
                                console.log(success)

                                if (success.value == true) {
                                    //System darkmode enabled
                                    if (config.data.theme == "devicebased") { set_dark() }
                                    document.getElementById('device_theme_btn').style.color = "white"
                                    document.getElementById('device_theme_btn').style.backgroundColor = "black"

                                } else {
                                    //system darkmode dissabled
                                    if (config.data.theme == "devicebased") { set_light() }
                                    document.getElementById('device_theme_btn').style.color = "black"
                                    document.getElementById('device_theme_btn').style.backgroundColor = "white"
                                }
                            },
                            function (error) {//failed to detect a theme
                                //unable to can, use default
                                console.log(error)
                                set_light()
                            }
                        );
                    } else {//theme detection is un-availible
                        document.getElementById('set_device').style.display = "none";
                        document.getElementById('theme_bar').classList = "theme_bar_2";
                    }
                },
                function (error) {//Theme detection error
                    console.log(error)
                    set_light()
                }
            );

            if (config.data.theme == "dark") {
                set_dark()
                document.getElementById('dark_theme_btn').classList = "themebtn_active"
                document.getElementById('light_theme_btn').classList = "thembtn"
                document.getElementById('device_theme_btn').classList = "thembtn"
            } else if (config.data.theme == "light") {
                set_light()
                document.getElementById('dark_theme_btn').classList = "thembtn"
                document.getElementById('light_theme_btn').classList = "themebtn_active"
                document.getElementById('device_theme_btn').classList = "thembtn"
            } else if (config.data.theme == "devicebased") {
                document.getElementById('dark_theme_btn').classList = "thembtn"
                document.getElementById('light_theme_btn').classList = "thembtn"
                document.getElementById('device_theme_btn').classList = "themebtn_active"
            } else {
                //thme error
            }

            function set_dark() {
                if (utility.properties.first_start = true) { document.getElementById('hue' + config.data.accent_color + '-selec').classList = "accent_blob_active" }
                switch (config.data.accent_color) {
                    case -1:
                        document.getElementById('body').classList = "dark";
                        console.log('Dark inverse theme');
                        break;
                    case 0:
                        document.getElementById('body').classList = "dark _0";
                        console.log('%cdark _0', "color: hsl(0,100%,50%)")
                        break;
                    case 30:
                        document.getElementById('body').classList = "dark _30";
                        console.log('%cdark _30', "color: hsl(30,100%,50%)");
                        break;
                    case 60:
                        document.getElementById('body').classList = "dark _60";
                        console.log('%cdark _60', "color: hsl(60,100%,50%)");
                        break;
                    case 90:
                        document.getElementById('body').classList = "dark _90";
                        console.log('%cdark _90', "color: hsl(90,100%,50%)");
                        break;
                    case 120:
                        document.getElementById('body').classList = "dark _120";
                        console.log('%cdark _120', "color: hsl(120,100%,50%)");
                        break;
                    case 150:
                        document.getElementById('body').classList = "dark _150";
                        console.log('%cdark _150', "color: hsl(150,100%,50%)");
                        break;
                    case 180:
                        document.getElementById('body').classList = "dark _180";
                        console.log('%cdark _180', "color: hsl(180,100%,50%)");
                        break;
                    case 210:
                        document.getElementById('body').classList = "dark _210";
                        console.log('%cdark _210', "color: hsl(210,100%,50%)");
                        break;
                    case 240:
                        document.getElementById('body').classList = "dark _240";
                        console.log('%cdark _240', "color: hsl(240,100%,50%)");
                        break;
                    case 270:
                        document.getElementById('body').classList = "dark _270";
                        console.log('%cdark _270', "color: hsl(270,100%,50%)");
                        break;
                    case 300:
                        document.getElementById('body').classList = "dark _300";
                        console.log('%cdark _300', "color: hsl(300,100%,50%)");
                        break;
                    case 330:
                        document.getElementById('body').classList = "dark _330";
                        console.log('%cdark _330', "color: hsl(330,100%,50%)");
                        break;
                    default:
                        console.error('Theme error :', config.data.accent_color);
                        document.getElementById('body').classList = "dark _210";
                        config.data.accent_color = 210;
                }
            }

            function set_light() {
                if (utility.properties.first_start = true) { document.getElementById('hue' + config.data.accent_color + '-selec').classList = "accent_blob_active" }
                switch (config.data.accent_color) {
                    case -1:
                        document.getElementById('body').classList = "light";
                        console.log('light inverse theme');
                        break;
                    case 0:
                        document.getElementById('body').classList = "light _0";
                        console.log('%clight_0', "color: hsl(0,100%,50%)")
                        break;
                    case 30:
                        document.getElementById('body').classList = "light _30";
                        console.log('%clight_30', "color: hsl(30,100%,50%)");
                        break;
                    case 60:
                        document.getElementById('body').classList = "light _60";
                        console.log('%clight_60', "color: hsl(60,100%,50%)");
                        break;
                    case 90:
                        document.getElementById('body').classList = "light _90";
                        console.log('%clight_90', "color: hsl(90,100%,50%)");
                        break;
                    case 120:
                        document.getElementById('body').classList = "light _120";
                        console.log('%clight_120', "color: hsl(120,100%,50%)");
                        break;
                    case 150:
                        document.getElementById('body').classList = "light _150";
                        console.log('%clight_150', "color: hsl(150,100%,50%)");
                        break;
                    case 180:
                        document.getElementById('body').classList = "light _180";
                        console.log('%clight_180', "color: hsl(180,100%,50%)");
                        break;
                    case 210:
                        document.getElementById('body').classList = "light _210";
                        console.log('%clight_210', "color: hsl(210,100%,50%)");
                        break;
                    case 240:
                        document.getElementById('body').classList = "light _240";
                        console.log('%clight_240', "color: hsl(240,100%,50%)");
                        break;
                    case 270:
                        document.getElementById('body').classList = "light _270";
                        console.log('%clight_270', "color: hsl(270,100%,50%)");
                        break;
                    case 300:
                        document.getElementById('body').classList = "light _300";
                        console.log('%clight_300', "color: hsl(300,100%,50%)");
                        break;
                    case 330:
                        document.getElementById('body').classList = "light _330";
                        console.log('%clight_330', "color: hsl(330,100%,50%)");
                        break;
                    default:
                        console.error('Theme error :', config.data.accent_color);
                        document.getElementById('body').classList = "light _210";
                        config.data.accent_color = 210;
                }
            }
        },
        animation: {
            flip: function () {
                console.log('animation switch triggered');
                if (config.data.animation == true) {//turn off the switch
                    config.data.animation = false;
                    utility.toast('animations dissabled');
                    console.log('animations dissabled');
                } else {//turn on the witch
                    config.data.animation = true;
                    utility.toast('animations enabled');
                    console.log('animations enabled');
                }
                config.save();
                Ui.setting.animation.setpostition();
            },
            setpostition: function () {
                if (config.data.animation == true) {
                    document.getElementById('anim').href = "";
                    document.getElementById('Animations_switch_container').className = 'switch_container_active';
                } else {
                    document.getElementById('anim').href = "css/noanime.css";//nomation sheet removes animations
                    document.getElementById('Animations_switch_container').className = 'switch_container_dissabled';
                }
            },
        },
    }
}

let utility = {//Some usefull things
    properties: {
        exit: false,
        first_start: true,
    },
    exit_strategy: function () {//Heres how to string things togther to make something usefull
        console.warn('Exit strategy triggered')
        if (utility.properties.exit == true) {
            utility.close()
        } else {
            utility.properties.exit = true;
            utility.toast("Press back button again to exit", 2000)
            setTimeout(() => { utility.properties.exit = false }, 2000)
        }
    },
    /*  Close the app   */
    close: function () {
        console.trace('App closure triggered via')
        //config_handler.save()
        if (navigator.app) {
            navigator.app.exitApp()
        } else if (navigator.device) {
            navigator.device.exitApp()
        } else {
            window.close()
        }
    },
    /* Check screen size (physical/app size) */
    size_check: async function () {
        console.log('Sizecheck fired');
        if (typeof (window.plugins) != 'undefined') {
            window.plugins.screensize.get(function (result) {//Check device screen size
                console.log(result);
                if (result.diameter < 3) {
                    //watch size screen
                    document.getElementById('stylesheet').href = "css/watch.css"
                    console.warn('Set watch screen scale with size: ', result.diameter);
                } else if (result.diameter > 6) {
                    //tablet size screen
                    document.getElementById('stylesheet').href = "css/tablet.css"
                    console.warn('Set tablet screen scale with size: ', result.diameter);
                } else {
                    //phone size screen
                    document.getElementById('stylesheet').href = "css/phone.css"
                    console.warn('Set phone screen scale with size: ', result.diameter);
                }
                //utility.toast('Screensize: '+result.diameter,5000);
            }, function (err) { console.log('Screen data error: ', err) });
        } else {
            console.error('Screensize plugin failed completely, device may not be ready');
        }
    },
    /*  Produce toast messages    */
    toast: function (text, durration_in_ms, position_top_right_left_bottom, offset_in_px) {
        if (position_top_right_left_bottom == undefined) { position_top_right_left_bottom = 'bottom' }//default the position
        if (durration_in_ms == undefined) { durration_in_ms = 4000 }//default the duration
        if (offset_in_px == undefined) { offset_in_px = -160 }//default the offset
        window.plugins.toast.showWithOptions({ message: text, duration: durration_in_ms, position: position_top_right_left_bottom, addPixelsY: offset_in_px })
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