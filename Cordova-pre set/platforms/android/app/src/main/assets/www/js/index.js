const remote_host = 'http://192.168.0.9:1999';

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
};
app.initialize()

function maininitalizer() {//Runs after 'Device ready'
    if (localStorage.getItem("APPname_cfg")) {
        config.load()
    }
    size_check()
    Ui.initialize()

    setTimeout(() => {
        navigator.splashscreen.hide();//hide splashscreen
        window.addEventListener('resize', function () { size_check() })//App is resized by split screen or dex
        properties.first_start = false;//App is startedned up
    }, 300);
    post({phone:'phone phones home'}, '/post/test')
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
    save: async function () {//Save the config file
        console.warn('Configuration is being saved')
        localStorage.setItem("APPname_cfg", JSON.stringify(config.data))
        console.table(config.data)
    },
    load: function () {//Load the config file
        console.warn('Configuration is being loaded')
        config.data = JSON.parse(localStorage.getItem("APPname_cfg"))
        console.table(config.data)
    },
    delete: function () {//Does not delete the file itself. Just sets it to empty
        localStorage.clear("APPname_cfg")
        console.log('config deleted: ')
        console.table(config.data)
    },
    backup: async function () {
        console.log('Config Backup')

        filepath = 'Download/timetable_backup.json'

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {//Request access to file system

            fs.root.getFile(filepath, { create: true, exclusive: false }, function (fileEntry) {//Creates fileentry relitive to the root directory on android /storage/emulated/0/
                console.log("fileEntry is file :" + fileEntry.isFile.toString())// is file a file?
                fileEntry.createWriter(function (fileWriter) {//creates file writer from file entry

                    fileWriter.write(JSON.stringify(config.data))//write to file

                    fileWriter.onwriteend = function () {//file writing complete
                        console.log("Successful file write: ", fileEntry.fullPath)
                        toast("Saved to: " + fileEntry.fullPath)
                    }

                    fileWriter.onerror = function (e) {//error
                        console.log("Failed file write: " + e.toString())
                        toast("Failed file write: " + e.toString())
                    }
                })

            }, function () {//file entry fails
                console.log('failed to create file entry')
                toast('failed to create file entry, app may not have file permissions')
            })
        }, function () {//No file permission given
            console.error('Failed to get file permissions')
            toast('Failed to get file permissions')
        })
    },
    restore: async function () {
        console.log('Config restore')

        //filepath = '/testfile.json'//filepath
        var file = chooser.getFile()

        await file.then((file) => {
            console.log('FIle chosen: ', file)
            window.resolveLocalFileSystemURL(file[0].uri, function (Entry) {
                console.log('Resolved uri: ', Entry.fullPath)//got file path, but needs to be resolved
                var experimentalpath = Entry.fullPath.replace('/com.android.providers.downloads.documents/document/raw:/storage/emulated/0', '')
                var experimentalpath = experimentalpath.replace('/com.android.externalstorage.documents/document/primary:', '/')
                cordova.file.
                    console.log(experimentalpath)
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {//Request access to file system
                    fs.root.getFile(experimentalpath, { create: false, exclusive: true }, function (fileEntry) {//Creates fileentry relitive to the root directory on android /storage/emulated/0/
                        console.log("fileEntry is file :" + fileEntry.isFile.toString())// is file a file?

                        fileEntry.file(function (file) {
                            var reader = new FileReader();

                            reader.onloadend = function () {
                                console.log("file loadend event output: " + this.result);
                                var parsed_data = this.result;
                                parsed_data = JSON.parse(parsed_data);
                                if (parsed_data.key == "TT01") {
                                    console.log('This is a config file, load its ass')
                                    utility.toast('Loaded configuration from: ' + experimentalpath)

                                    config.data = parsed_data;
                                    config.save()
                                    UI.setting.hilight.setpostition()
                                    UI.setting.animation.setpostition()
                                    UI.setting.tiles.setpostition()
                                    UI.setting.Row.setpostition()
                                    UI.setting.wallpaper.set_wallpaper()
                                    UI.setting.set_theme()
                                    table.data_render()
                                    manage.initalize()
                                } else {
                                    console.log('This is not a config file for this app')
                                    utility.toast('This is not a config file for this app')
                                }
                            }
                            console.log('File reader output text: ', reader.readAsText(file))//reader.readASText required
                        }, function () {
                            console.log('file error')
                        });

                    }, function () {//file entry fails
                        console.log('failed to create file entry')
                        utility.toast('failed to create file entry, app may not have file permissions')
                    })
                }, function () {//No file permission given
                    console.error('Failed to get file permissions')
                    utility.toast('Failed to get file permissions')
                })

            }, function () { console.error('Failed to resolve URI') })
        })
    }
}

let Ui = {
    initialize: async function () {//start ui logic
        console.warn('Ui initalize')

        this.navigate.lastmain_view()
        this.setting.animation.setpostition()
        this.setting.set_theme()

        document.getElementById('view_1_btn').addEventListener('click', Ui.navigate.view_1)
        document.getElementById('view_2_btn').addEventListener('click', Ui.navigate.view_2)
        document.getElementById('setting_btn').addEventListener('click', Ui.navigate.setting)
        document.getElementById('Animations_btn').addEventListener('click', Ui.setting.animation.flip)
        document.getElementById('backup_btn').addEventListener('click', function () {
            directory_manager.startup('select-folder')//select folder to place bakcup file
        })
        document.getElementById('restore_btn').addEventListener('click', function () {
            directory_manager.startup('select-file')//select file to restore from
        })

        document.getElementById('set_device').addEventListener('click', function () {
            config.data.theme = "devicebased"
            config.save();
            Ui.setting.set_theme()
            toast('following device theme')
        })
        document.getElementById('set_dark').addEventListener('click', function () {
            config.data.theme = "dark"
            config.save();
            Ui.setting.set_theme()
            toast('Dark theme')
        })
        document.getElementById('set_light').addEventListener('click', function () {
            config.data.theme = "light"
            config.save();
            Ui.setting.set_theme()
            toast('Light theme')
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

            //detect device theme and adjust accordingly
            cordova.plugins.ThemeDetection.isAvailable(function (success) {
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
            }, function (error) {//Theme detection error
                console.log(error)
                set_light()
            });

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
                StatusBar.styleLightContent()
                StatusBar.backgroundColorByHexString('#000000')
                if (properties.first_start = true) { document.getElementById('hue' + config.data.accent_color + '-selec').classList = "accent_blob_active" }
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
                        document.getElementById('body').classList = "dark";
                        config.data.accent_color = -1;
                }
            }

            function set_light() {
                if (properties.first_start = true) { document.getElementById('hue' + config.data.accent_color + '-selec').classList = "accent_blob_active" }
                switch (config.data.accent_color) {
                    case -1:
                        document.getElementById('body').classList = "light";
                        console.log('light inverse theme');
                        StatusBar.styleDefault()
                        StatusBar.backgroundColorByHexString('#ffffff')
                        break;
                    case 0:
                        document.getElementById('body').classList = "light _0";
                        console.log('%clight_0', "color: hsl(0,100%,50%)")
                        StatusBar.backgroundColorByHexString('#ff0000')
                        break;
                    case 30:
                        document.getElementById('body').classList = "light _30";
                        console.log('%clight_30', "color: hsl(30,100%,50%)");
                        StatusBar.backgroundColorByHexString('#ff8000')
                        StatusBar.styleLightContent()
                        break;
                    case 60:
                        document.getElementById('body').classList = "light _60";
                        console.log('%clight_60', "color: hsl(60,100%,50%)");
                        StatusBar.backgroundColorByHexString('#ffff00')
                        StatusBar.styleDefault()
                        break;
                    case 90:
                        document.getElementById('body').classList = "light _90";
                        console.log('%clight_90', "color: hsl(90,100%,50%)");
                        StatusBar.backgroundColorByHexString('#80ff00')
                        StatusBar.styleDefault()
                        break;
                    case 120:
                        document.getElementById('body').classList = "light _120";
                        console.log('%clight_120', "color: hsl(120,100%,50%)");
                        StatusBar.backgroundColorByHexString('#00ff00')
                        StatusBar.styleDefault()
                        break;
                    case 150:
                        document.getElementById('body').classList = "light _150";
                        console.log('%clight_150', "color: hsl(150,100%,50%)");
                        StatusBar.backgroundColorByHexString('#00ff80')
                        StatusBar.styleDefault()
                        break;
                    case 180:
                        document.getElementById('body').classList = "light _180";
                        console.log('%clight_180', "color: hsl(180,100%,50%)");
                        StatusBar.backgroundColorByHexString('#00ffff')
                        StatusBar.styleDefault()
                        break;
                    case 210:
                        document.getElementById('body').classList = "light _210";
                        console.log('%clight_210', "color: hsl(210,100%,50%)");
                        StatusBar.backgroundColorByHexString('#0080ff')
                        StatusBar.styleLightContent()
                        break;
                    case 240:
                        document.getElementById('body').classList = "light _240";
                        console.log('%clight_240', "color: hsl(240,100%,50%)");
                        StatusBar.backgroundColorByHexString('#0000ff')
                        StatusBar.styleLightContent()
                        break;
                    case 270:
                        document.getElementById('body').classList = "light _270";
                        console.log('%clight_270', "color: hsl(270,100%,50%)");
                        StatusBar.backgroundColorByHexString('#8000ff')
                        StatusBar.styleLightContent()
                        break;
                    case 300:
                        document.getElementById('body').classList = "light _300";
                        console.log('%clight_300', "color: hsl(300,100%,50%)");
                        StatusBar.backgroundColorByHexString('#ff00ff')
                        StatusBar.styleLightContent()
                        break;
                    case 330:
                        document.getElementById('body').classList = "light _330";
                        console.log('%clight_330', "color: hsl(330,100%,50%)");
                        StatusBar.backgroundColorByHexString('#ff0080')
                        StatusBar.styleLightContent()
                        break;
                    default:
                        console.error('Theme error :', config.data.accent_color);
                        document.getElementById('body').classList = "light";
                        config.data.accent_color = -1;
                }
            }
        },
        animation: {
            flip: function () {
                console.log('animation switch triggered');
                if (config.data.animation == true) {//turn off the switch
                    config.data.animation = false;
                    toast('animations dissabled');
                    console.log('animations dissabled');
                } else {//turn on the witch
                    config.data.animation = true;
                    toast('animations enabled');
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

let directory_manager = {
    selected_dir: null,
    targets: ['start'],//old targets
    path_names: ['/'],//keep track of names
    mode: 'default',//default, select-file, select-folder
    startup: function (selection) {
        console.log('fake directory manager starts')


        switch (selection) {
            case 'select-file':
                document.getElementById('select_button').innerHTML = 'Select this file';
                directory_manager.mode = selection;
                break;
            case 'select-folder':
                document.getElementById('select_button').innerHTML = 'Select this folder';
                directory_manager.mode = selection;
                break;
            default:
                document.getElementById('select_button').innerHTML = 'Select';
                directory_manager.mode = 'default';
        }
        document.getElementById('directory_container').innerHTML = '' //Clear Out The current directories

        directory_manager.targets = ['start']//reset target array to default

        CordovaExternalStoragePlugin.getExternalStorageDirs(function (sdCardDirs) {// sdCardDirs contains an array of possible sdCard locations ["XXXX-XXXX"].
            console.log('Building root dirs: ', sdCardDirs, ' found: ', sdCardDirs.length)
            if (sdCardDirs.length < 2) {//only internal storage
                window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dirEntry) {//resolves directory paths
                    var directoryReader = dirEntry.createReader();
                    directoryReader.readEntries(function (entries) {
                        directory_manager.render(entries)
                    }, function () { console.log('Failed to read dirrectiories') });
                })
            } else {//multipe directories, sdcard or otherwide
                for (let i = 0; i < sdCardDirs.length; i++) { build_root_directories(sdCardDirs[i]) }
            }
        })
        toast('Press back button to close', 2000);

        function build_root_directories(root_dir) {
            //build directory
            let directory_doot = document.createElement('directory_doot')//direcctory doot
            directory_doot.classList = "directory_doot"
            let directory_name = document.createElement('div')//directory name
            directory_name.classList = "directory_name"
            directory_name.innerHTML = root_dir
            directory_doot.appendChild(directory_name)
            let directory_icon = document.createElement('div')
            directory_icon.classList = "directory_icon"
            directory_doot.appendChild(directory_icon)

            document.getElementById('directory_container').appendChild(directory_doot)
            directory_doot.addEventListener('click', function () {//clicky functions
                console.log('Clicked directory: ', root_dir)
                directory_manager.fetch_data('file:///' + root_dir)
                //directory_manager.path_names.push(entry.fullPath)
                directory_manager.selected_dir = 'file:///' + root_dir
                if (directory_manager.mode == 'select-folder') {//if folder selection mode
                    document.getElementById('select_button').disabled = false
                    document.getElementById('select_button').classList = "select_button"
                }
            })
        }

        this.show()
    },
    goBack: function () {
        console.log('Returning to last directory')
        if (directory_manager.targets.length > 1) {
            if (directory_manager.targets.pop() == 'start') {//we must go back by 2
                directory_manager.hide()
            } else {
                if (directory_manager.targets[directory_manager.targets.length - 1] == 'start') {
                    directory_manager.startup()
                } else {
                    directory_manager.fetch_data(directory_manager.targets.pop())
                }
                /*var last_path = directory_manager.path_names.pop()
                if (last_path == undefined || directory_manager.path_names[directory_manager.path_names.length - 1] == undefined) {
                    //document.getElementById('path_rep').innerText = '/'
                } else {
                    //document.getElementById('path_rep').innerHTML = directory_manager.path_names[directory_manager.path_names.length - 1]
                }*/
            }
        } else {
            directory_manager.hide()
        }
    },
    fetch_data: function (target) {//use .nativeURL as target
        directory_manager.targets.push(target)
        window.resolveLocalFileSystemURL(target, function (dirEntry) {//resolves directory paths
            var directoryReader = dirEntry.createReader();
            directoryReader.readEntries(function (entries) {
                if (entries.length > 20) { startload_anime() }
                directory_manager.render(entries);
                stopload_anime();
            }, function () { console.log('Failed to read dirrectiories') });
        })
    },
    render: function (entries) {//Build directories here
        document.getElementById('directory_container').innerHTML = ''
        console.log(entries)

        //document.getElementById('path_rep').innerText = 

        for (let index = 0; index < entries.length; index++) { directorize(entries[index]) }

        function directorize(entry) {
            console.log('Build directory: ', entry);

            //build directory
            let directory_doot = document.createElement('directory_doot')//direcctory doot
            directory_doot.classList = "directory_doot"
            let directory_name = document.createElement('div')//directory name
            directory_name.classList = "directory_name"
            directory_name.innerHTML = entry.name
            directory_doot.appendChild(directory_name)

            if (entry.isDirectory == true) {//add directory icon
                let directory_icon = document.createElement('div')
                directory_icon.classList = "directory_icon"
                directory_doot.appendChild(directory_icon)

                directory_doot.addEventListener('click', function () {//Navigate to and select directory
                    console.log('Clicked directory: ', entry)
                    directory_manager.fetch_data(entry.nativeURL)
                    document.getElementById('path_rep').innerHTML = entry.fullPath
                    directory_manager.path_names.push(entry.fullPath)
                    directory_manager.selected_dir = entry.fullPath
                })

            } else if (entry.isFile == true && directory_manager.mode != 'select-folder') {//determine file type and apply icon
                let file_icon = document.createElement('div')
                file_icon.classList = "file_icon"
                directory_doot.appendChild(file_icon)
                /*var sniffed_ext = entry.fullPath.slice(-6);
                console.log('Sniffed extension: ', sniffed_ext)*/

                directory_doot.addEventListener('click', function () {//hilight file
                    console.log('Clicked directory: ', entry)
                    //directory_manager.fetch_data(entry.nativeURL)
                    document.getElementById('path_rep').innerHTML = entry.fullPath
                    //directory_manager.path_names.push(entry.fullPath)
                    directory_manager.selected_dir = entry.fullPath
                    if (this.classList == "directory_doot") {
                        this.classList = "directory_doot_active"
                    } else {
                        this.classList = "directory_doot"
                    }
                })

            } else {//whats not a file and not a folder

            }

            document.getElementById('directory_container').appendChild(directory_doot)

        }
    },
    hide: function () {
        console.log('file_directory hide')
        document.getElementById('file_directory').style.display = "none"
    },
    show: function () {
        console.log('file_directory show')
        document.getElementById('file_directory').style.display = "block"
    },
}

let properties = {
    exit: false,
    first_start: true,
}

async function back() {
    if (document.getElementById('file_directory').style.display == "block") {
        directory_manager.goBack()
    } else if (document.getElementById('setting_view').style.display == "block") {
        Ui.navigate.lastmain_view();
    } else {
        exit_strategy();
    }
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

async function size_check() {// Check screen size (physical/app size)
    console.log('Sizecheck fired');
    if (typeof (window.plugins) != 'undefined') {
        window.plugins.screensize.get(function (result) {//Check device screen size
            console.log(result);
            if (result.diameter < 3) {//watch size screen
                document.getElementById('stylesheet').href = "css/watch.css"
                console.warn('Set watch screen scale with size: ', result.diameter);
            } else if (result.diameter > 7) {//tablet size screen
                document.getElementById('stylesheet').href = "css/tablet.css"
                console.warn('Set tablet screen scale with size: ', result.diameter);
            } else {//phone size screen
                document.getElementById('stylesheet').href = "css/phone.css"
                console.warn('Set phone screen scale with size: ', result.diameter);
            }
            //toast('Screensize: '+result.diameter,5000);
        }, function (err) { console.log('Screen data error: ', err) });
    } else {
        console.error('Screensize plugin failed completely, device may not be ready');
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

async function startload_anime() { document.getElementById('loadot').classList = "loadot_active" }

async function stopload_anime() { document.getElementById('loadot').classList = "loadot" }

// Wraped post and get functions
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
