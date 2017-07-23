'use strict';

const co = require('co');
const BROWSER_TYPE = process.env.BROWSER || 'chrome';
const webdriver = require('selenium-webdriver'),
  By = webdriver.By;

const FIREBASE_URL = 'https://boost-staging.firebaseio.com';
const FIREBASE_SECRET = 'tGedvz92xMZzq8l0sL8GHc7D70BHQU12FVT09u1y'

const Firebase = require('firebase');
const firebase = new Firebase(FIREBASE_URL);
firebase.auth().signInWithCustomToken(FIREBASE_SECRET);

const delay = timeout => new Promise((resolve, reject) => setTimeout(resolve, timeout));
const expect = require('chai').expect;

const TEST_NUMBER = '3107568556';
const TEST_NUMBER2 = '4242425495';

describe('Login Page', () => {
  beforeEach(function () {
    this.driver = createDriver();
  })

  afterEach(function * () {
    this.driver.quit();
  });


  it('should login', co.wrap(function * () {
    this.timeout(20 * 1000);
    const phoneNumber = TEST_NUMBER;
    const driver = this.driver;
    driver.get('https://web-stg.boo.st');
    yield delay(4000);

    driver.findElement(By.css('.form-control')).sendKeys(phoneNumber);
    yield delay(6000);
    driver.findElement(By.css('.form-button')).click();
    yield delay(2000);
    const code = yield waitForValue(`mobileNumbers/+1${phoneNumber}/code`);
    yield delay(2000);

    driver.findElement(By.css('#requestTokenField')).sendKeys(code);
    yield delay(2000);
    driver.findElement(By.css('.form-button')).click();
    yield delay(2000);

    const currentUrl = yield driver.getCurrentUrl();

    expect(currentUrl).to.equal('https://web-stg.boo.st/dashboard.html');
    this.driver.quit();
  }));
});

describe('Sign up Page', () => {
  beforeEach(function () {
    deleteUser(TEST_NUMBER2);
    this.driver = createDriver();
  })

  afterEach(function * () {
    this.driver.quit();
  });


  it('should sign up', co.wrap(function * () {
    this.timeout(30 * 1000);
    const phoneNumber = TEST_NUMBER2;
    const driver = this.driver;
    driver.get('https://web-stg.boo.st');
    yield delay(4000);

    driver.findElement(By.css('.form-control')).sendKeys(phoneNumber);
    yield delay(6000);
    driver.findElement(By.css('.form-button')).click();
    yield delay(2000);
    const code = yield waitForValue(`mobileNumbers/+1${phoneNumber}/code`);
    yield delay(2000);

    driver.findElement(By.css('#requestTokenField')).sendKeys(`${code}\n`);
    yield delay(2000);

    driver.findElement(By.css('#firstName')).sendKeys('Jonny');
    driver.findElement(By.css('#lastName')).sendKeys('Apple');
    driver.findElement(By.css('#emailAddress')).sendKeys('Jonny@gmail.com');
    driver.findElement(By.css('#address1')).sendKeys('11277 Thorson ave.');
    driver.findElement(By.css('#city')).sendKeys('Lynwood');
    driver.findElement(By.css('#state')).sendKeys('CA');
    driver.findElement(By.css('#postalCode')).sendKeys('90262\n');
    yield delay(3000);

    driver.findElement(By.css('#cc-number')).sendKeys('4242424242424242');
    driver.findElement(By.css('#cc-ccv')).sendKeys('210');
    driver.findElement(By.css('#expMonth')).sendKeys('6\n');
    driver.findElement(By.css('#expYear')).sendKeys('2019\n\n90262\n');
    yield delay(4000);

    const currentUrl = yield driver.getCurrentUrl();
    expect(currentUrl).to.equal('https://web-stg.boo.st/dashboard.html');
    this.driver.quit();
  }));
});

function waitForNewValue (path, timeout) {
  return new Promise((resolve, reject) => {
    var resolved = false;
    var oldVal;
    firebase.child(path).on('value', snap => {
      if (typeof oldVal == 'undefined') {
        oldVal = snap.val();
      } else if (oldVal != snap.val()) {
        resolved = true;
        resolve(snap.val());
      }
    });
    delay(timeout || 5000).then(() => resolved || reject(new Error('Timed out')));
  });
}

function deleteUser (number) {
  firebase.child('queues/messages/tasks').push({From: '+1' + number, Body: '### delete me ###'});
}


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

function createDriver () {
  return new webdriver.Builder()
  .forBrowser(BROWSER_TYPE)
  .build();
}
