import '../common';
import { expect } from 'chai';
import { put} from 'redux-saga/effects';
import UI from 'action-types/ui';
import { submitPhone, confirmCode, instagramConnect, twitterConnect, removeInstagram, removeTwitter, submitAddress, submitEmail, submitPayment, removePayment, updatePayment } from 'sagas/dashboard.js';

describe('Submit Phone SAGA', () => {
  it('Should dispatch the submitPhone saga', () => {
    const mockAction = {payload:{}};
    const number = mockAction.payload;
    const generator = submitPhone(number);
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_START', payload: {} }));
  });
});

describe('Confirm Code SAGA', () => {
  it('Should dispatch the confirmCode saga', () => {
    const mockAction = {payload:{}};
    const { number, code } = mockAction.payload;
    const generator = confirmCode(number, code);
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/STORE_SIGNUP_NUMBER', payload: null }));
  });
});


describe('Twitter Connect SAGA', () => {
  it('Should dispatch the twitterConnect saga', () => {
    const mockAction = {payload:{}};
    const { loginUrl, oauthToken, oauthTokenSecret } = mockAction.payload;
    const generator = twitterConnect(loginUrl, oauthToken, oauthTokenSecret);
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_START', payload: {} }));
  });
});

describe('Remove Twitter SAGA', () => {
  it('Should dispatch the removeTwitter saga', () => {
    const mockAction = {payload:{}};
    const generator = removeTwitter();
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_START', payload: {} }));
  });
});

describe('Instagram Connect SAGA', () => {
  it('Should dispatch the instagramConnect saga', () => {
    const mockAction = {payload:{}};
    const loginUrl = mockAction.payload;
    const generator = instagramConnect(loginUrl);
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_START', payload: {} }));
  });
});

describe('Remove Instagram SAGA', () => {
  it('Should dispatch the removeInstagram saga', () => {
    const mockAction = {payload:{}};
    const generator = removeInstagram();
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_START', payload: {} }));
  });
});

describe('Submit Address SAGA', () => {
  it('Should dispatch the submitAddress saga', () => {
    const mockAction = {payload:{}};
    const { firstName, lastName, address1, address2, city, state, postalCode, country } = mockAction.payload;
    const mailingAddress = {firstName, lastName, address1, address2, city, state, postalCode, country};
    const generator = submitAddress(mailingAddress);
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/ADD_NOTIFICATION', payload: {} }));
  });
});

describe('Submit Email SAGA', () => {
  it('Should dispatch the submitEmail saga', () => {
    const mockAction = {payload:{}};
    const emailAddress = mockAction.payload;
    const generator = submitEmail(emailAddress);
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_START', payload: {} }));
  });
});

describe('Submit Payment SAGA', () => {
  it('Should dispatch the submitPayment saga', () => {
    const mockAction = {payload:{}};
    const cardInfo = mockAction.payload;
    const generator = submitPayment(cardInfo);
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_START' }));
  });
});

describe('Remove Payment SAGA', () => {
  it('Should dispatch the removePayment saga', () => {
    const generator = removePayment();
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_START' }));
  });
});

describe('Update Payment SAGA', () => {
  it('Should dispatch the removePayment saga', () => {
    const mockAction = {payload:{}};
    const {cardId, exp_month, exp_year, address_zip }  = mockAction.payload;
    const generator = updatePayment(cardId, exp_month, exp_year, address_zip);
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_START' }));
  });
});


