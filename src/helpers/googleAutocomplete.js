'use strict';

import Deferred from 'helpers/deferred.js';
import { googleMapsKey } from 'config';
import { EventEmitter } from 'events';

/* global google */

let loadingDeferred = [];
const componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  sublocality_level_1: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'short_name',
  postal_code: 'short_name'
};

export default class GoogleAutocomplete extends EventEmitter {
  autocomplete = null;

  constructor (element) {
    super();
    this.element = element;
    this.autocomplete = new google.maps.places.Autocomplete(element, {
      types: ['geocode'],
      componentRestrictions: {country: 'us'}
    });
    this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
  }

  fillInAddress () {
    const place = this.autocomplete.getPlace();
    const address = {};

    if (!place || !place.address_components) {
      return;
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
      const addressType = place.address_components[i].types[0];
      let key = addressType;
      if (componentForm[addressType]) {
        let val = place.address_components[i][componentForm[addressType]];
        if (addressType === 'locality') {
          key = 'city';
        } else if (addressType === 'sublocality_level_1' && !address.city) {
          key = 'city';
        } else if (addressType === 'postal_code') {
          key = 'postalCode';
        } else if (addressType == 'administrative_area_level_1') {
          key = 'state';
        } else if (addressType == 'street_number') {
          key = 'address1';
          val = `${val} ${address[key] || ''}`;
        } else if (addressType == 'route') {
          key = 'address1';
          val = `${address[key] || ''} ${val}`;
        } else if (addressType == 'country') {
          key = 'country';
        }
        address[key] = val;
      }
    }

    this.emit('autocomplete', address);
  }

  //region geolocation
  geolocate () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        const circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        this.autocomplete.setBounds(circle.getBounds());
      });
    }
  }
}

export const initAutocomplete = (element) => {
  return loadGMapsApi().then(() => {
    return new GoogleAutocomplete(element);
  });
};

export const apiLoaded = () => typeof google !== 'undefined' && google.maps && google.maps.places && google.maps.places.Autocomplete;

export const loadGMapsApi = () => {
  if (apiLoaded()) {
    return Promise.resolve();
  }
  const deferred = new Deferred();
  if (loadingDeferred.length > 0) {
    loadingDeferred.push(deferred);
    return deferred.promise;
  }

  const s = document.createElement('script');
  s.src = 'https://maps.googleapis.com/maps/api/js?key=' + googleMapsKey + '&signed_in=true&libraries=places&callback=__GMapsApiCallback__';
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);

  global.__GMapsApiCallback__ = () => {
    delete global.__GMapsApiCallback__;
    loadingDeferred.forEach(d => d.resolve());
    loadingDeferred = [];
  };

  s.onerror = loadingDeferred.forEach(deferred => deferred.reject());

  loadingDeferred.push(deferred);
  return deferred.promise;
};
