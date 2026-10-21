(function (window) {
  'use strict';

  var registry = {};
  var waiters = {};

  function ensureWaiterBucket(name) {
    if (!waiters[name]) waiters[name] = [];
    return waiters[name];
  }

  function notify(name, payload) {
    var bucket = ensureWaiterBucket(name);
    while (bucket.length) {
      bucket.shift()(payload);
    }
  }

  function registerLibrary(name, api) {
    if (!name || typeof name !== 'string') {
      throw new Error('registerLibrary requires a non-empty string library name.');
    }

    registry[name] = {
      name: name,
      api: api,
      registeredAt: Date.now()
    };

    notify(name, registry[name]);
    return registry[name];
  }

  function hasLibrary(name) {
    return Boolean(registry[name]);
  }

  function getLibrary(name) {
    return registry[name] || null;
  }

  function waitForLibrary(name, timeoutMs) {
    var timeout = typeof timeoutMs === 'number' ? timeoutMs : 10000;

    if (hasLibrary(name)) {
      return Promise.resolve(getLibrary(name));
    }

    return new Promise(function (resolve, reject) {
      var done = false;
      var timerId = window.setTimeout(function () {
        if (done) return;
        done = true;
        reject(new Error('Timed out waiting for library: ' + name));
      }, timeout);

      ensureWaiterBucket(name).push(function (entry) {
        if (done) return;
        done = true;
        window.clearTimeout(timerId);
        resolve(entry);
      });
    });
  }

  function loadLibraries(libs, options) {
    var opts = options || {};
    var libNames = (Array.isArray(libs) ? libs : []).filter(function (name) {
      return typeof name === 'string' && name.trim() !== '';
    });

    var missing = libNames.filter(function (name) {
      return !hasLibrary(name);
    });

    if (!missing.length) {
      return Promise.resolve({
        requestId: '',
        loaded: libNames.map(function (name) { return getLibrary(name); }),
        requested: []
      });
    }

    if (!window.ApexFMBridge || typeof window.ApexFMBridge.requestLibraries !== 'function') {
      return Promise.reject(new Error('ApexFMBridge.requestLibraries is required before loadLibraries.'));
    }

    var requestResult = window.ApexFMBridge.requestLibraries({
      module: opts.module || 'apex',
      action: opts.action || 'loadLibs',
      formName: opts.formName || '',
      libs: missing,
      apexLibName: opts.apexLibName || 'lib',
      bundleVersion: opts.bundleVersion || '',
      scriptName: opts.scriptName,
      scriptOption: opts.scriptOption,
      debugAlerts: opts.debugAlerts
    });

    if (!requestResult.ok) {
      return Promise.reject(new Error(requestResult.bridge.errorMessage || 'Failed to request libraries from FileMaker.'));
    }

    return Promise.all(missing.map(function (name) {
      return waitForLibrary(name, opts.timeoutMs);
    })).then(function () {
      return {
        requestId: requestResult.requestId,
        loaded: libNames.map(function (name) { return getLibrary(name); }),
        requested: missing
      };
    });
  }

  function listLibraries() {
    return Object.keys(registry).sort();
  }

  window.ApexLibLoader = {
    registerLibrary: registerLibrary,
    hasLibrary: hasLibrary,
    getLibrary: getLibrary,
    listLibraries: listLibraries,
    waitForLibrary: waitForLibrary,
    loadLibraries: loadLibraries
  };

  window.apexFMPRegisterLibrary = function (name, api) {
    return registerLibrary(name, api);
  };
})(window);
