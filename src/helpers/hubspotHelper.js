/* global hbspt */

import Deferred from 'helpers/deferred.js';

const HUBSPOT_FORM_SCRIPT = '//js.hsforms.net/forms/v2.js';
const HUBSPOT_PORTAL_ID = '2191723';
const HUBSPOT_FORM_ID = 'a13bfdaa-c110-43d3-92db-fd5681d86e3d';

const status = {loaded: false, pending: []};

export const loadForm = async function (target) {
  await preload();
  hbspt.forms.create({
    css: '',
    portalId: HUBSPOT_PORTAL_ID,
    formId: HUBSPOT_FORM_ID,
    submitButtonClass: 'form-button primary',
    target: target
  });
};

export const preload = () => {
  if (status.loaded) {
    return Promise.resolve();
  }
  const deferred = new Deferred();
  if (status.pending.length > 0) {
    status.pending.push(deferred);
    return deferred.promise;
  }

  const s = document.createElement('script');
  s.src = HUBSPOT_FORM_SCRIPT;
  document.head.appendChild(s);
  s.onerror = () => status.pending.forEach(deferred => deferred.reject());
  s.onload = () => {
    status.loaded = true;
    status.pending.forEach(deferred => deferred.resolve());
    status.pending = [];
  };

  status.pending.push(deferred);
  return deferred.promise;
};
