cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-x-toast.Toast",
      "file": "plugins/cordova-plugin-x-toast/www/Toast.js",
      "pluginId": "cordova-plugin-x-toast",
      "clobbers": [
        "window.plugins.toast"
      ]
    },
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "cordova-plugin-splashscreen.SplashScreen",
      "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
      "pluginId": "cordova-plugin-splashscreen",
      "clobbers": [
        "navigator.splashscreen"
      ]
    },
    {
      "id": "cordova-plugin-screensize.screensize",
      "file": "plugins/cordova-plugin-screensize/www/screensize.js",
      "pluginId": "cordova-plugin-screensize",
      "clobbers": [
        "window.plugins.screensize"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-x-toast": "2.7.2",
    "cordova-plugin-device": "2.0.3",
    "cordova-plugin-splashscreen": "5.0.3",
    "cordova-plugin-screensize": "1.3.1"
  };
});