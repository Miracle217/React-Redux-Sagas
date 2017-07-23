'use strict';

const Browser = require('zombie');
const browser = new Browser({silent: true});
const expect = require('chai').expect;
const co = require('co');
const delay = timeout => new Promise((resolve, reject) => setTimeout(resolve, timeout));

const FIREBASE_URL = 'https://boost-staging.firebaseio.com';
const FIREBASE_SECRET = 'tGedvz92xMZzq8l0sL8GHc7D70BHQU12FVT09u1y'

const Firebase = require('firebase');
const firebase = new Firebase(FIREBASE_URL);
firebase.auth().signInWithCustomToken(FIREBASE_SECRET);


const TEST_PHONE_NUMBER = '+16264988899';


const fs = require('fs');

const logs = fs.createWriteStream('test.log', {flags: 'a'}); // append
browser.on('console', (level, value) => logs.write(` -- ${level} -- ${value}\n`));


describe('Loads pages', function(z){
  console.log(arguments)
  const phoneNumber = TEST_PHONE_NUMBER;
  it('Boost home page', co.wrap(function * () {
    this.timeout(60 * 1000);
    const done = this.callback;
    yield browser.visit("http://web-stg.boo.st/");
    expect(browser.text("title")).to.equal('Boost | Users');
    yield delay(2000);
    console.log(browser.window.document.querySelector('[data-reactroot]').innerHTML);
    browser.click('a[href="/signup.html"]');
    // wait for login page to load
    yield delay(5000);
    console.log(browser.window.document.querySelector('[data-reactroot]').innerHTML);
    console.log(browser.window.document.querySelectorAll('h1')[0].textContent)
    console.log(browser.url)
    console.log(''+browser.window.location);
  }));


  it('Boost home page', co.wrap(function * () {
    return;
    this.timeout(60 * 1000);
    const done = this.callback;
    yield browser.visit("http://web-stg.boo.st/");
    expect(browser.text("title")).to.equal('Boost | Users');
    // wait for login page to load
    yield delay(2000);

    browser.fill('.form-control', phoneNumber);
    browser.pressButton('send me a login code');
    yield delay(2000);

    {
      const errorMessageElements = browser.window.document.querySelectorAll('.alert-box.alert');
      const errorMessages = Array.from(errorMessageElements).map(el => el.textContent);

      console.log(errorMessages);
      expect(errorMessages).to.be.empty;
    }

    const value = yield waitForValue(`mobileNumbers/${phoneNumber}/code`);
    console.log(`Login code is `, value);

    browser.assert.url('/')
    browser.fill('#requestTokenField', value);
    browser.pressButton('log in');
    yield delay(200);

    while( true ) {

      const sp = browser.window.document.querySelector('.spinner');
      if (!sp) {
        break;
      }
      console.log(sp.textContent);
      yield delay(100);
    }

    {
      const errorMessageElements = browser.window.document.querySelectorAll('.alert-box.alert');
      const errorMessages = Array.from(errorMessageElements).map(el => el.textContent);

      console.log(errorMessages);
      expect(errorMessages).to.be.empty;
    }


    browser.assert.url('/dashboard.html')
    done();
  }));
});

function waitForValue (path, timeout) {
  return new Promise((resolve, reject) => {
    var resolved = false;
    firebase.child(path).on('value', snap => {
      if (snap.exists()) {
        resolved = true;
        resolve(snap.val());
      }
    });
    delay(timeout || 5000).then(() => resolved || reject(new Error('Timed out')));
  });
}
