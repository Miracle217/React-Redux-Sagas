import '../common';
import { expect } from 'chai';
import { put} from 'redux-saga/effects';
import { logout, phoneLogin, phoneLoginConfirm, emailLogin, emailLoginConfirm } from 'sagas/user.js';

describe('Logout SAGA', () => {
  it('Should dispatch the logout saga', () => {
    const generator = logout();
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/CLEAR_NOTIFICATIONS', payload: {} }));
  });
});

describe('Phone Login SAGA', () => {
  it('Should dispatch the phoneLogin saga', () => {
    const mockAction = {payload:{}};
    const number = mockAction.payload;
    const generator = phoneLogin(number);
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_END', payload: {} }));
  });
});

describe('Phone Login Confirm SAGA', () => {
  it('Should dispatch the phoneLoginConfirm saga', () => {
    const mockAction = {payload:{}};
    const { number, code }  = mockAction.payload;
    const generator = phoneLoginConfirm(number, code);
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_END', payload: {} }));
  });
});

describe('Email login SAGA', () => {
  it('Should dispatch the emailLogin saga', () => {
    const mockAction = {payload:{}};
    const email = mockAction.payload;
    const generator = emailLogin(email);
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_END', payload: {} }));
  });
});

describe('Email login Confirm SAGA', () => {
  it('Should dispatch the emailLoginConfirm saga', () => {
    const mockAction = {payload:{}};
    const { email, code } = mockAction.payload;
    const generator = emailLoginConfirm(email, code);
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/LOAD_END', payload: {} }));
  });
});


