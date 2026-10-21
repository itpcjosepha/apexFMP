(function (window) {
  'use strict';

  var DEFAULT_SCRIPT_NAME = '(orc)apexFMP[(module;action;formName;formParam)JSON]';

  function performScript(scriptName, parameter, scriptOption) {
    var targetScript = scriptName || DEFAULT_SCRIPT_NAME;
    var option = typeof scriptOption === 'number' ? scriptOption : 0;

    if (!window.FileMaker) {
      return {
        ok: false,
        code: 'FILEMAKER_UNAVAILABLE',
        message: 'window.FileMaker is not available in this context.'
      };
    }

    if (typeof window.FileMaker.PerformScriptWithOption === 'function') {
      window.FileMaker.PerformScriptWithOption(targetScript, parameter, option);
      return { ok: true, method: 'PerformScriptWithOption' };
    }

    if (typeof window.FileMaker.PerformScript === 'function') {
      window.FileMaker.PerformScript(targetScript, parameter);
      return { ok: true, method: 'PerformScript' };
    }

    return {
      ok: false,
      code: 'FILEMAKER_METHOD_MISSING',
      message: 'FileMaker object exists but no supported PerformScript method was found.'
    };
  }

  function executeScriptPayload(payloadObj, options) {
    var opts = options || {};
    var payload = payloadObj || {};
    var jsonPayload = JSON.stringify(payload);
    var result;

    try {
      result = performScript(opts.scriptName || DEFAULT_SCRIPT_NAME, jsonPayload, opts.scriptOption);
    } catch (error) {
      result = {
        ok: false,
        code: 'SCRIPT_EXECUTION_ERROR',
        message: String(error && error.message ? error.message : error)
      };
    }

    if (!result.ok && opts.debugAlerts) {
      window.alert('Bridge Error:\n' + (result.message || 'Unknown error'));
    }

    return {
      ok: result.ok,
      method: result.method || '',
      payload: payload,
      payloadJSON: jsonPayload,
      errorCode: result.code || '',
      errorMessage: result.message || ''
    };
  }

  function requestLibraries(request) {
    var req = request || {};
    var libs = Array.isArray(req.libs) ? req.libs : [];
    var requestId = req.requestId || ('libs-' + Date.now() + '-' + Math.floor(Math.random() * 1000000));

    var bridgePayload = {
      module: req.module || 'apex',
      action: req.action || 'loadLibs',
      formName: req.formName || '',
      formParam: JSON.stringify({
        requestId: requestId,
        libs: libs,
        apexLibName: req.apexLibName || 'lib',
        bundleVersion: req.bundleVersion || ''
      })
    };

    var bridgeResult = executeScriptPayload(bridgePayload, {
      scriptName: req.scriptName,
      scriptOption: req.scriptOption,
      debugAlerts: req.debugAlerts
    });

    return {
      ok: bridgeResult.ok,
      requestId: requestId,
      libs: libs,
      bridge: bridgeResult
    };
  }

  window.ApexFMBridge = {
    scriptName: DEFAULT_SCRIPT_NAME,
    performScript: performScript,
    executeScriptPayload: executeScriptPayload,
    requestLibraries: requestLibraries
  };
})(window);
