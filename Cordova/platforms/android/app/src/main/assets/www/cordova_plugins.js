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
    },
    {
      "id": "cordova-plugin-theme-detection.ThemeDetection",
      "file": "plugins/cordova-plugin-theme-detection/www/ThemeDetection.js",
      "pluginId": "cordova-plugin-theme-detection",
      "clobbers": [
        "cordova.plugins.ThemeDetection"
      ]
    },
    {
      "id": "cordova-plugin-battery-status.battery",
      "file": "plugins/cordova-plugin-battery-status/www/battery.js",
      "pluginId": "cordova-plugin-battery-status",
      "clobbers": [
        "navigator.battery"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-x-toast": "2.7.2",
    "cordova-plugin-device": "2.0.3",
    "cordova-plugin-splashscreen": "5.0.3",
    "cordova-plugin-screensize": "1.3.1",
    "cordova-plugin-theme-detection": "1.2.1",
    "cordova-plugin-battery-status": "2.0.3"
  };
});