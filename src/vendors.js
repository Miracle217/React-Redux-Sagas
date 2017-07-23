'use strict';
/* eslint-disable */
import fetch from 'whatwg-fetch';
import Promise from 'native-promise-only';
import 'babel-polyfill';
import rollbar from 'rollbar-browser';
import { rollbarAccessToken, environment, googleAnalyticsToken } from './config.js';
import getNortonBadge from './norton.js';

// this has to be a require because of the jQuery dependency
//import jQuery from 'jquery';
//global.jQuery = jQuery;

if (typeof global.Promise === 'undefined') {
  global.Promise = Promise;
}
if (typeof global.fetch === 'undefined') {
  global.fetch = fetch;
}

global.getNortonBadge = getNortonBadge;


// load Rollbar
if (rollbarAccessToken) {
  const rollbarConfig = {
    accessToken: rollbarAccessToken,
    captureUncaught: true,
    payload: {
      environment: environment
    },
    enabled: (environment === 'development' || environment === 'local') ? false : true
  };
  global.Rollbar = rollbar.init(rollbarConfig);
}

if (googleAnalyticsToken) {
  // load GA
  (function(i, s, o, g, r, a, m){i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function(){
  (i[r].q = i[r].q || []).push(arguments);}, i[r].l = 1 * new Date(); a = s.createElement(o),
  m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m);
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

  ga('create', googleAnalyticsToken, 'auto');
}
