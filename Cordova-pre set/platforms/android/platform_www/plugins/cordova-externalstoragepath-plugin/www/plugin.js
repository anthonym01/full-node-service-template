cordova.define("cordova-externalstoragepath-plugin.plugin", function(require, exports, module) {
var exec = require('cordova/exec');

var PLUGIN_NAME = 'CordovaExternalStoragePlugin';

var CordovaExternalStoragePlugin = {
  getExternalStorageDirs: function(cb) {
    exec(cb, null, PLUGIN_NAME, 'getExternalStorageDirs', []);
  }
};

module.exports = CordovaExternalStoragePlugin;

});
