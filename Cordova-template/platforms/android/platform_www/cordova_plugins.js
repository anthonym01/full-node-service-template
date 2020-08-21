cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-externalstoragepath-plugin.plugin",
      "file": "plugins/cordova-externalstoragepath-plugin/www/plugin.js",
      "pluginId": "cordova-externalstoragepath-plugin",
      "clobbers": [
        "CordovaExternalStoragePlugin"
      ],
      "runs": true
    }
  ];
  module.exports.metadata = {
    "cordova-externalstoragepath-plugin": "1.0.0"
  };
});