'use strict';

const TEST_NUMBER = '+16264988899';

const FIREBASE_URL = 'https://boost-staging.firebaseio.com';
const FIREBASE_SECRET = 'tGedvz92xMZzq8l0sL8GHc7D70BHQU12FVT09u1y'

const Firebase = require('firebase');
const firebase = new Firebase(FIREBASE_URL);
firebase.auth().signInWithCustomToken(FIREBASE_SECRET);

const co = require('co');


module.exports.sendSMS = message => firebase.child('queues/messages/tasks').push({From: TEST_NUMBER, Body: message});
module.exports.firebase = firebase;
module.exports.TEST_NUMBER = TEST_NUMBER;
