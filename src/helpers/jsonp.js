/*
 * From http://stackoverflow.com/a/22780569/141363 modified
 * to return Promise.
 *
 * Usage: jsonp(url)
 *          .then(success)
 *          .catch(error);
 */
const body = document.body;

export default (url, noCallback) => new Promise(function(resolve, reject) {
  var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random()),
    script = createScript(url, callbackName);

  // If we fail to get the script, reject the promise.
  script.onerror = reject;

  body.appendChild(script);
  // If the url contains a 'something_callback=?' then
  // replace the '?' with our random generated callbackName.
  if (/callback=?/.test(url)) {
    url = url.replace('=?', '=' + callbackName);
  }

  if (noCallback) {
    resolve();
    body.removeChild(script);
    return;
  }

  global[callbackName] = function(data) {
    // Script inserted, resolve promise.
    resolve(data);

    // Clean up.
    global[callbackName] = null;
    delete global[callbackName];
    body.removeChild(script);
  };
});

function createScript(url, callbackName) {
  var script = document.createElement('script');
  script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;

  return script;
}
