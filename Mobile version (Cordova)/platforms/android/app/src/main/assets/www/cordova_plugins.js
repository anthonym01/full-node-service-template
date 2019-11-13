cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-x-toast.Toast",
      "file": "plugins/cordova-plugin-x-toast/www/Toast.js",
      "pluginId": "cordova-plugin-x-toast",
      "clobbers": [
        "window.plugins.toast"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.3",
    "cordova-plugin-x-toast": "2.7.2"
  };
});