import '../common';
import { expect } from 'chai';
import { put} from 'redux-saga/effects';
import { submitPhone, resubmitPhone, confirmCode, usePhone, useTwitter, useInstagram, submitAddress, submitPayment } from 'sagas/signup.js';

describe('Submit Phone SAGA', () => {
  it('Should dispatch the submitPhone saga', () => {
    const mockAction = {payload:{}};
    const number = mockAction.payload;
    const generator = submitPhone(number);
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_START', payload: {} }));
  });
});

describe('Resubmit Phone SAGA', () => {
  it('Should dispatch the resubmitPhone saga', () => {
    const mockAction = {payload:{}};
    const number = mockAction.payload;
    const generator = resubmitPhone(number);
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

describe('Use Phone SAGA', () => {
  it('Should dispatch the usePhone saga', () => {
    const mockAction = {payload:{}};
    const generator = usePhone();
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_START', payload: {} }));
  });
});

describe('Use Twitter SAGA', () => {
  it('Should dispatch the useTwitter saga', () => {
    const mockAction = {payload:{}};
    const generator = useTwitter();
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_START', payload: {} }));
  });
});

describe('Use Instagram SAGA', () => {
  it('Should dispatch the useInstagram saga', () => {
    const mockAction = {payload:{}};
    const generator = useInstagram();
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

describe('Submit Payment SAGA', () => {
  it('Should dispatch the submitPayment saga', () => {
    const mockAction = {payload:{}};
    const cardInfo = mockAction.payload;
    const generator = submitPayment(cardInfo);
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_START' }));
  });
});
