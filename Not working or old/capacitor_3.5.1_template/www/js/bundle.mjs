(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');

const App = core.registerPlugin('App', {
    web: () => Promise.resolve().then(function () { return web; }).then(m => new m.AppWeb()),
});

class AppWeb extends core.WebPlugin {
    constructor() {
        super();
        this.handleVisibilityChange = () => {
            const data = {
                isActive: document.hidden !== true,
            };
            this.notifyListeners('appStateChange', data);
        };
        document.addEventListener('visibilitychange', this.handleVisibilityChange, false);
    }
    exitApp() {
        throw this.unimplemented('Not implemented on web.');
    }
    async getInfo() {
        throw this.unimplemented('Not implemented on web.');
    }
    async getLaunchUrl() {
        return { url: '' };
    }
    async getState() {
        return { isActive: document.hidden !== true };
    }
    async minimizeApp() {
        throw this.unimplemented('Not implemented on web.');
    }
}

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AppWeb: AppWeb
});

exports.App = App;


},{"@capacitor/core":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');

const Browser$1 = core.registerPlugin('Browser', {
    web: () => Promise.resolve().then(function () { return web; }).then(m => new m.BrowserWeb()),
});

class BrowserWeb extends core.WebPlugin {
    constructor() {
        super();
        this._lastWindow = null;
    }
    async open(options) {
        this._lastWindow = window.open(options.url, options.windowName || '_blank');
    }
    async close() {
        return new Promise((resolve, reject) => {
            if (this._lastWindow != null) {
                this._lastWindow.close();
                this._lastWindow = null;
                resolve();
            }
            else {
                reject('No active window to close!');
            }
        });
    }
}
const Browser = new BrowserWeb();

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BrowserWeb: BrowserWeb,
    Browser: Browser
});

exports.Browser = Browser$1;


},{"@capacitor/core":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');

exports.CameraSource = void 0;
(function (CameraSource) {
    /**
     * Prompts the user to select either the photo album or take a photo.
     */
    CameraSource["Prompt"] = "PROMPT";
    /**
     * Take a new photo using the camera.
     */
    CameraSource["Camera"] = "CAMERA";
    /**
     * Pick an existing photo fron the gallery or photo album.
     */
    CameraSource["Photos"] = "PHOTOS";
})(exports.CameraSource || (exports.CameraSource = {}));
exports.CameraDirection = void 0;
(function (CameraDirection) {
    CameraDirection["Rear"] = "REAR";
    CameraDirection["Front"] = "FRONT";
})(exports.CameraDirection || (exports.CameraDirection = {}));
exports.CameraResultType = void 0;
(function (CameraResultType) {
    CameraResultType["Uri"] = "uri";
    CameraResultType["Base64"] = "base64";
    CameraResultType["DataUrl"] = "dataUrl";
})(exports.CameraResultType || (exports.CameraResultType = {}));

const Camera$1 = core.registerPlugin('Camera', {
    web: () => Promise.resolve().then(function () { return web; }).then(m => new m.CameraWeb()),
});

class CameraWeb extends core.WebPlugin {
    async getPhoto(options) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            if (options.webUseInput || options.source === exports.CameraSource.Photos) {
                this.fileInputExperience(options, resolve);
            }
            else if (options.source === exports.CameraSource.Prompt) {
                let actionSheet = document.querySelector('pwa-action-sheet');
                if (!actionSheet) {
                    actionSheet = document.createElement('pwa-action-sheet');
                    document.body.appendChild(actionSheet);
                }
                actionSheet.header = options.promptLabelHeader || 'Photo';
                actionSheet.cancelable = false;
                actionSheet.options = [
                    { title: options.promptLabelPhoto || 'From Photos' },
                    { title: options.promptLabelPicture || 'Take Picture' },
                ];
                actionSheet.addEventListener('onSelection', async (e) => {
                    const selection = e.detail;
                    if (selection === 0) {
                        this.fileInputExperience(options, resolve);
                    }
                    else {
                        this.cameraExperience(options, resolve, reject);
                    }
                });
            }
            else {
                this.cameraExperience(options, resolve, reject);
            }
        });
    }
    async pickImages(_options) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            this.multipleFileInputExperience(resolve);
        });
    }
    async cameraExperience(options, resolve, reject) {
        if (customElements.get('pwa-camera-modal')) {
            const cameraModal = document.createElement('pwa-camera-modal');
            cameraModal.facingMode =
                options.direction === exports.CameraDirection.Front ? 'user' : 'environment';
            document.body.appendChild(cameraModal);
            try {
                await cameraModal.componentOnReady();
                cameraModal.addEventListener('onPhoto', async (e) => {
                    const photo = e.detail;
                    if (photo === null) {
                        reject(new core.CapacitorException('User cancelled photos app'));
                    }
                    else if (photo instanceof Error) {
                        reject(photo);
                    }
                    else {
                        resolve(await this._getCameraPhoto(photo, options));
                    }
                    cameraModal.dismiss();
                    document.body.removeChild(cameraModal);
                });
                cameraModal.present();
            }
            catch (e) {
                this.fileInputExperience(options, resolve);
            }
        }
        else {
            console.error(`Unable to load PWA Element 'pwa-camera-modal'. See the docs: https://capacitorjs.com/docs/pwa-elements.`);
            this.fileInputExperience(options, resolve);
        }
    }
    fileInputExperience(options, resolve) {
        let input = document.querySelector('#_capacitor-camera-input');
        const cleanup = () => {
            var _a;
            (_a = input.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(input);
        };
        if (!input) {
            input = document.createElement('input');
            input.id = '_capacitor-camera-input';
            input.type = 'file';
            input.hidden = true;
            document.body.appendChild(input);
            input.addEventListener('change', (_e) => {
                const file = input.files[0];
                let format = 'jpeg';
                if (file.type === 'image/png') {
                    format = 'png';
                }
                else if (file.type === 'image/gif') {
                    format = 'gif';
                }
                if (options.resultType === 'dataUrl' ||
                    options.resultType === 'base64') {
                    const reader = new FileReader();
                    reader.addEventListener('load', () => {
                        if (options.resultType === 'dataUrl') {
                            resolve({
                                dataUrl: reader.result,
                                format,
                            });
                        }
                        else if (options.resultType === 'base64') {
                            const b64 = reader.result.split(',')[1];
                            resolve({
                                base64String: b64,
                                format,
                            });
                        }
                        cleanup();
                    });
                    reader.readAsDataURL(file);
                }
                else {
                    resolve({
                        webPath: URL.createObjectURL(file),
                        format: format,
                    });
                    cleanup();
                }
            });
        }
        input.accept = 'image/*';
        input.capture = true;
        if (options.source === exports.CameraSource.Photos ||
            options.source === exports.CameraSource.Prompt) {
            input.removeAttribute('capture');
        }
        else if (options.direction === exports.CameraDirection.Front) {
            input.capture = 'user';
        }
        else if (options.direction === exports.CameraDirection.Rear) {
            input.capture = 'environment';
        }
        input.click();
    }
    multipleFileInputExperience(resolve) {
        let input = document.querySelector('#_capacitor-camera-input-multiple');
        const cleanup = () => {
            var _a;
            (_a = input.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(input);
        };
        if (!input) {
            input = document.createElement('input');
            input.id = '_capacitor-camera-input-multiple';
            input.type = 'file';
            input.hidden = true;
            input.multiple = true;
            document.body.appendChild(input);
            input.addEventListener('change', (_e) => {
                const photos = [];
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let i = 0; i < input.files.length; i++) {
                    const file = input.files[i];
                    let format = 'jpeg';
                    if (file.type === 'image/png') {
                        format = 'png';
                    }
                    else if (file.type === 'image/gif') {
                        format = 'gif';
                    }
                    photos.push({
                        webPath: URL.createObjectURL(file),
                        format: format,
                    });
                }
                resolve({ photos });
                cleanup();
            });
        }
        input.accept = 'image/*';
        input.click();
    }
    _getCameraPhoto(photo, options) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const format = photo.type.split('/')[1];
            if (options.resultType === 'uri') {
                resolve({
                    webPath: URL.createObjectURL(photo),
                    format: format,
                    saved: false,
                });
            }
            else {
                reader.readAsDataURL(photo);
                reader.onloadend = () => {
                    const r = reader.result;
                    if (options.resultType === 'dataUrl') {
                        resolve({
                            dataUrl: r,
                            format: format,
                            saved: false,
                        });
                    }
                    else {
                        resolve({
                            base64String: r.split(',')[1],
                            format: format,
                            saved: false,
                        });
                    }
                };
                reader.onerror = e => {
                    reject(e);
                };
            }
        });
    }
    async checkPermissions() {
        if (typeof navigator === 'undefined' || !navigator.permissions) {
            throw this.unavailable('Permissions API not available in this browser');
        }
        try {
            // https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query
            // the specific permissions that are supported varies among browsers that implement the
            // permissions API, so we need a try/catch in case 'camera' is invalid
            const permission = await window.navigator.permissions.query({
                name: 'camera',
            });
            return {
                camera: permission.state,
                photos: 'granted',
            };
        }
        catch (_a) {
            throw this.unavailable('Camera permissions are not available in this browser');
        }
    }
    async requestPermissions() {
        throw this.unimplemented('Not implemented on web.');
    }
}
const Camera = new CameraWeb();

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CameraWeb: CameraWeb,
    Camera: Camera
});

exports.Camera = Camera$1;


},{"@capacitor/core":4}],4:[function(require,module,exports){
(function (global){(function (){
/*! Capacitor: https://capacitorjs.com/ - MIT License */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const createCapacitorPlatforms = (win) => {
    const defaultPlatformMap = new Map();
    defaultPlatformMap.set('web', { name: 'web' });
    const capPlatforms = win.CapacitorPlatforms || {
        currentPlatform: { name: 'web' },
        platforms: defaultPlatformMap,
    };
    const addPlatform = (name, platform) => {
        capPlatforms.platforms.set(name, platform);
    };
    const setPlatform = (name) => {
        if (capPlatforms.platforms.has(name)) {
            capPlatforms.currentPlatform = capPlatforms.platforms.get(name);
        }
    };
    capPlatforms.addPlatform = addPlatform;
    capPlatforms.setPlatform = setPlatform;
    return capPlatforms;
};
const initPlatforms = (win) => (win.CapacitorPlatforms = createCapacitorPlatforms(win));
/**
 * @deprecated Set `CapacitorCustomPlatform` on the window object prior to runtime executing in the web app instead
 */
const CapacitorPlatforms = /*#__PURE__*/ initPlatforms((typeof globalThis !== 'undefined'
    ? globalThis
    : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
            ? window
            : typeof global !== 'undefined'
                ? global
                : {}));
/**
 * @deprecated Set `CapacitorCustomPlatform` on the window object prior to runtime executing in the web app instead
 */
const addPlatform = CapacitorPlatforms.addPlatform;
/**
 * @deprecated Set `CapacitorCustomPlatform` on the window object prior to runtime executing in the web app instead
 */
const setPlatform = CapacitorPlatforms.setPlatform;

const legacyRegisterWebPlugin = (cap, webPlugin) => {
    var _a;
    const config = webPlugin.config;
    const Plugins = cap.Plugins;
    if (!config || !config.name) {
        // TODO: add link to upgrade guide
        throw new Error(`Capacitor WebPlugin is using the deprecated "registerWebPlugin()" function, but without the config. Please use "registerPlugin()" instead to register this web plugin."`);
    }
    // TODO: add link to upgrade guide
    console.warn(`Capacitor plugin "${config.name}" is using the deprecated "registerWebPlugin()" function`);
    if (!Plugins[config.name] || ((_a = config === null || config === void 0 ? void 0 : config.platforms) === null || _a === void 0 ? void 0 : _a.includes(cap.getPlatform()))) {
        // Add the web plugin into the plugins registry if there already isn't
        // an existing one. If it doesn't already exist, that means
        // there's no existing native implementation for it.
        // - OR -
        // If we already have a plugin registered (meaning it was defined in the native layer),
        // then we should only overwrite it if the corresponding web plugin activates on
        // a certain platform. For example: Geolocation uses the WebPlugin on Android but not iOS
        Plugins[config.name] = webPlugin;
    }
};

exports.ExceptionCode = void 0;
(function (ExceptionCode) {
    /**
     * API is not implemented.
     *
     * This usually means the API can't be used because it is not implemented for
     * the current platform.
     */
    ExceptionCode["Unimplemented"] = "UNIMPLEMENTED";
    /**
     * API is not available.
     *
     * This means the API can't be used right now because:
     *   - it is currently missing a prerequisite, such as network connectivity
     *   - it requires a particular platform or browser version
     */
    ExceptionCode["Unavailable"] = "UNAVAILABLE";
})(exports.ExceptionCode || (exports.ExceptionCode = {}));
class CapacitorException extends Error {
    constructor(message, code) {
        super(message);
        this.message = message;
        this.code = code;
    }
}
const getPlatformId = (win) => {
    var _a, _b;
    if (win === null || win === void 0 ? void 0 : win.androidBridge) {
        return 'android';
    }
    else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
        return 'ios';
    }
    else {
        return 'web';
    }
};

const createCapacitor = (win) => {
    var _a, _b, _c, _d, _e;
    const capCustomPlatform = win.CapacitorCustomPlatform || null;
    const cap = win.Capacitor || {};
    const Plugins = (cap.Plugins = cap.Plugins || {});
    /**
     * @deprecated Use `capCustomPlatform` instead, default functions like registerPlugin will function with the new object.
     */
    const capPlatforms = win.CapacitorPlatforms;
    const defaultGetPlatform = () => {
        return capCustomPlatform !== null
            ? capCustomPlatform.name
            : getPlatformId(win);
    };
    const getPlatform = ((_a = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _a === void 0 ? void 0 : _a.getPlatform) || defaultGetPlatform;
    const defaultIsNativePlatform = () => getPlatform() !== 'web';
    const isNativePlatform = ((_b = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _b === void 0 ? void 0 : _b.isNativePlatform) || defaultIsNativePlatform;
    const defaultIsPluginAvailable = (pluginName) => {
        const plugin = registeredPlugins.get(pluginName);
        if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
            // JS implementation available for the current platform.
            return true;
        }
        if (getPluginHeader(pluginName)) {
            // Native implementation available.
            return true;
        }
        return false;
    };
    const isPluginAvailable = ((_c = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _c === void 0 ? void 0 : _c.isPluginAvailable) ||
        defaultIsPluginAvailable;
    const defaultGetPluginHeader = (pluginName) => { var _a; return (_a = cap.PluginHeaders) === null || _a === void 0 ? void 0 : _a.find(h => h.name === pluginName); };
    const getPluginHeader = ((_d = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _d === void 0 ? void 0 : _d.getPluginHeader) || defaultGetPluginHeader;
    const handleError = (err) => win.console.error(err);
    const pluginMethodNoop = (_target, prop, pluginName) => {
        return Promise.reject(`${pluginName} does not have an implementation of "${prop}".`);
    };
    const registeredPlugins = new Map();
    const defaultRegisterPlugin = (pluginName, jsImplementations = {}) => {
        const registeredPlugin = registeredPlugins.get(pluginName);
        if (registeredPlugin) {
            console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
            return registeredPlugin.proxy;
        }
        const platform = getPlatform();
        const pluginHeader = getPluginHeader(pluginName);
        let jsImplementation;
        const loadPluginImplementation = async () => {
            if (!jsImplementation && platform in jsImplementations) {
                jsImplementation =
                    typeof jsImplementations[platform] === 'function'
                        ? (jsImplementation = await jsImplementations[platform]())
                        : (jsImplementation = jsImplementations[platform]);
            }
            else if (capCustomPlatform !== null &&
                !jsImplementation &&
                'web' in jsImplementations) {
                jsImplementation =
                    typeof jsImplementations['web'] === 'function'
                        ? (jsImplementation = await jsImplementations['web']())
                        : (jsImplementation = jsImplementations['web']);
            }
            return jsImplementation;
        };
        const createPluginMethod = (impl, prop) => {
            var _a, _b;
            if (pluginHeader) {
                const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find(m => prop === m.name);
                if (methodHeader) {
                    if (methodHeader.rtype === 'promise') {
                        return (options) => cap.nativePromise(pluginName, prop.toString(), options);
                    }
                    else {
                        return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
                    }
                }
                else if (impl) {
                    return (_a = impl[prop]) === null || _a === void 0 ? void 0 : _a.bind(impl);
                }
            }
            else if (impl) {
                return (_b = impl[prop]) === null || _b === void 0 ? void 0 : _b.bind(impl);
            }
            else {
                throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, exports.ExceptionCode.Unimplemented);
            }
        };
        const createPluginMethodWrapper = (prop) => {
            let remove;
            const wrapper = (...args) => {
                const p = loadPluginImplementation().then(impl => {
                    const fn = createPluginMethod(impl, prop);
                    if (fn) {
                        const p = fn(...args);
                        remove = p === null || p === void 0 ? void 0 : p.remove;
                        return p;
                    }
                    else {
                        throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, exports.ExceptionCode.Unimplemented);
                    }
                });
                if (prop === 'addListener') {
                    p.remove = async () => remove();
                }
                return p;
            };
            // Some flair ✨
            wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
            Object.defineProperty(wrapper, 'name', {
                value: prop,
                writable: false,
                configurable: false,
            });
            return wrapper;
        };
        const addListener = createPluginMethodWrapper('addListener');
        const removeListener = createPluginMethodWrapper('removeListener');
        const addListenerNative = (eventName, callback) => {
            const call = addListener({ eventName }, callback);
            const remove = async () => {
                const callbackId = await call;
                removeListener({
                    eventName,
                    callbackId,
                }, callback);
            };
            const p = new Promise(resolve => call.then(() => resolve({ remove })));
            p.remove = async () => {
                console.warn(`Using addListener() without 'await' is deprecated.`);
                await remove();
            };
            return p;
        };
        const proxy = new Proxy({}, {
            get(_, prop) {
                switch (prop) {
                    // https://github.com/facebook/react/issues/20030
                    case '$$typeof':
                        return undefined;
                    case 'toJSON':
                        return () => ({});
                    case 'addListener':
                        return pluginHeader ? addListenerNative : addListener;
                    case 'removeListener':
                        return removeListener;
                    default:
                        return createPluginMethodWrapper(prop);
                }
            },
        });
        Plugins[pluginName] = proxy;
        registeredPlugins.set(pluginName, {
            name: pluginName,
            proxy,
            platforms: new Set([
                ...Object.keys(jsImplementations),
                ...(pluginHeader ? [platform] : []),
            ]),
        });
        return proxy;
    };
    const registerPlugin = ((_e = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _e === void 0 ? void 0 : _e.registerPlugin) || defaultRegisterPlugin;
    // Add in convertFileSrc for web, it will already be available in native context
    if (!cap.convertFileSrc) {
        cap.convertFileSrc = filePath => filePath;
    }
    cap.getPlatform = getPlatform;
    cap.handleError = handleError;
    cap.isNativePlatform = isNativePlatform;
    cap.isPluginAvailable = isPluginAvailable;
    cap.pluginMethodNoop = pluginMethodNoop;
    cap.registerPlugin = registerPlugin;
    cap.Exception = CapacitorException;
    cap.DEBUG = !!cap.DEBUG;
    cap.isLoggingEnabled = !!cap.isLoggingEnabled;
    // Deprecated props
    cap.platform = cap.getPlatform();
    cap.isNative = cap.isNativePlatform();
    return cap;
};
const initCapacitorGlobal = (win) => (win.Capacitor = createCapacitor(win));

const Capacitor = /*#__PURE__*/ initCapacitorGlobal(typeof globalThis !== 'undefined'
    ? globalThis
    : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
            ? window
            : typeof global !== 'undefined'
                ? global
                : {});
const registerPlugin = Capacitor.registerPlugin;
/**
 * @deprecated Provided for backwards compatibility for Capacitor v2 plugins.
 * Capacitor v3 plugins should import the plugin directly. This "Plugins"
 * export is deprecated in v3, and will be removed in v4.
 */
const Plugins = Capacitor.Plugins;
/**
 * Provided for backwards compatibility. Use the registerPlugin() API
 * instead, and provide the web plugin as the "web" implmenetation.
 * For example
 *
 * export const Example = registerPlugin('Example', {
 *   web: () => import('./web').then(m => new m.Example())
 * })
 *
 * @deprecated Deprecated in v3, will be removed from v4.
 */
const registerWebPlugin = (plugin) => legacyRegisterWebPlugin(Capacitor, plugin);

/**
 * Base class web plugins should extend.
 */
class WebPlugin {
    constructor(config) {
        this.listeners = {};
        this.windowListeners = {};
        if (config) {
            // TODO: add link to upgrade guide
            console.warn(`Capacitor WebPlugin "${config.name}" config object was deprecated in v3 and will be removed in v4.`);
            this.config = config;
        }
    }
    addListener(eventName, listenerFunc) {
        const listeners = this.listeners[eventName];
        if (!listeners) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(listenerFunc);
        // If we haven't added a window listener for this event and it requires one,
        // go ahead and add it
        const windowListener = this.windowListeners[eventName];
        if (windowListener && !windowListener.registered) {
            this.addWindowListener(windowListener);
        }
        const remove = async () => this.removeListener(eventName, listenerFunc);
        const p = Promise.resolve({ remove });
        Object.defineProperty(p, 'remove', {
            value: async () => {
                console.warn(`Using addListener() without 'await' is deprecated.`);
                await remove();
            },
        });
        return p;
    }
    async removeAllListeners() {
        this.listeners = {};
        for (const listener in this.windowListeners) {
            this.removeWindowListener(this.windowListeners[listener]);
        }
        this.windowListeners = {};
    }
    notifyListeners(eventName, data) {
        const listeners = this.listeners[eventName];
        if (listeners) {
            listeners.forEach(listener => listener(data));
        }
    }
    hasListeners(eventName) {
        return !!this.listeners[eventName].length;
    }
    registerWindowListener(windowEventName, pluginEventName) {
        this.windowListeners[pluginEventName] = {
            registered: false,
            windowEventName,
            pluginEventName,
            handler: event => {
                this.notifyListeners(pluginEventName, event);
            },
        };
    }
    unimplemented(msg = 'not implemented') {
        return new Capacitor.Exception(msg, exports.ExceptionCode.Unimplemented);
    }
    unavailable(msg = 'not available') {
        return new Capacitor.Exception(msg, exports.ExceptionCode.Unavailable);
    }
    async removeListener(eventName, listenerFunc) {
        const listeners = this.listeners[eventName];
        if (!listeners) {
            return;
        }
        const index = listeners.indexOf(listenerFunc);
        this.listeners[eventName].splice(index, 1);
        // If there are no more listeners for this type of event,
        // remove the window listener
        if (!this.listeners[eventName].length) {
            this.removeWindowListener(this.windowListeners[eventName]);
        }
    }
    addWindowListener(handle) {
        window.addEventListener(handle.windowEventName, handle.handler);
        handle.registered = true;
    }
    removeWindowListener(handle) {
        if (!handle) {
            return;
        }
        window.removeEventListener(handle.windowEventName, handle.handler);
        handle.registered = false;
    }
}

const WebView = /*#__PURE__*/ registerPlugin('WebView');

exports.Capacitor = Capacitor;
exports.CapacitorException = CapacitorException;
exports.CapacitorPlatforms = CapacitorPlatforms;
exports.Plugins = Plugins;
exports.WebPlugin = WebPlugin;
exports.WebView = WebView;
exports.addPlatform = addPlatform;
exports.registerPlugin = registerPlugin;
exports.registerWebPlugin = registerWebPlugin;
exports.setPlatform = setPlatform;


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');

const Storage = core.registerPlugin('Storage', {
    web: () => Promise.resolve().then(function () { return web; }).then(m => new m.StorageWeb()),
});

class StorageWeb extends core.WebPlugin {
    constructor() {
        super(...arguments);
        this.group = 'CapacitorStorage';
    }
    async configure({ group }) {
        if (typeof group === 'string') {
            this.group = group;
        }
    }
    async get(options) {
        const value = this.impl.getItem(this.applyPrefix(options.key));
        return { value };
    }
    async set(options) {
        this.impl.setItem(this.applyPrefix(options.key), options.value);
    }
    async remove(options) {
        this.impl.removeItem(this.applyPrefix(options.key));
    }
    async keys() {
        const keys = this.rawKeys().map(k => k.substring(this.prefix.length));
        return { keys };
    }
    async clear() {
        for (const key of this.rawKeys()) {
            this.impl.removeItem(key);
        }
    }
    async migrate() {
        var _a;
        const migrated = [];
        const existing = [];
        const oldprefix = '_cap_';
        const keys = Object.keys(this.impl).filter(k => k.indexOf(oldprefix) === 0);
        for (const oldkey of keys) {
            const key = oldkey.substring(oldprefix.length);
            const value = (_a = this.impl.getItem(oldkey)) !== null && _a !== void 0 ? _a : '';
            const { value: currentValue } = await this.get({ key });
            if (typeof currentValue === 'string') {
                existing.push(key);
            }
            else {
                await this.set({ key, value });
                migrated.push(key);
            }
        }
        return { migrated, existing };
    }
    async removeOld() {
        const oldprefix = '_cap_';
        const keys = Object.keys(this.impl).filter(k => k.indexOf(oldprefix) === 0);
        for (const oldkey of keys) {
            this.impl.removeItem(oldkey);
        }
    }
    get impl() {
        return window.localStorage;
    }
    get prefix() {
        return this.group === 'NativeStorage' ? '' : `${this.group}.`;
    }
    rawKeys() {
        return Object.keys(this.impl).filter(k => k.indexOf(this.prefix) === 0);
    }
    applyPrefix(key) {
        return this.prefix + key;
    }
}

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    StorageWeb: StorageWeb
});

exports.Storage = Storage;


},{"@capacitor/core":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');

const Toast = core.registerPlugin('Toast', {
    web: () => Promise.resolve().then(function () { return web; }).then(m => new m.ToastWeb()),
});

class ToastWeb extends core.WebPlugin {
    async show(options) {
        if (typeof document !== 'undefined') {
            let duration = 2000;
            if (options.duration) {
                duration = options.duration === 'long' ? 3500 : 2000;
            }
            const toast = document.createElement('pwa-toast');
            toast.duration = duration;
            toast.message = options.text;
            document.body.appendChild(toast);
        }
    }
}

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ToastWeb: ToastWeb
});

exports.Toast = Toast;


},{"@capacitor/core":4}],7:[function(require,module,exports){
//const { Browser, App, Camera, Toast, Storage } = Plugins;
const Browser = require('@capacitor/browser');
const App = require('@capacitor/app');
const Camera = require('@capacitor/camera');
const Toast = require('@capacitor/toast');
const Storage = require('@capacitor/storage');

/*import { Browser } from '@capacitor/browser';
import { App } from '../../node_modules/@capacitor/app';
import { Camera } from '../../node_modules/@capacitor/camera';
import { Toast } from '../../node_modules/@capacitor/toast';
import { Storage } from '../../node_modules/@capacitor/storage';*/

const remote_host = 'localhost:1999';//a host

App.addListener('appStateChange', ({ isActive }) => {// app state is changed, usually sent to the background or suspended
    console.warn('App state changed. Is active: ', isActive);
});

App.addListener('backButton', () => {//back button on android
    console.warn('back button pressed')
})

window.addEventListener('load', async function () {

    try {
        await config.load()
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
},{"@capacitor/app":1,"@capacitor/browser":2,"@capacitor/camera":3,"@capacitor/storage":5,"@capacitor/toast":6}]},{},[7]);
