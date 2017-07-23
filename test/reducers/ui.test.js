import '../common';

import { expect } from 'chai';
import uiReducer from 'reducers/ui';
import UI from 'action-types/ui';
import { MENU_TOGGLE, STORE_LOGIN_NUMBER, STORE_LOGIN_EMAIL, STORE_SIGNUP_NUMBER, STORE_SIGNUP_EMAIL, DASHBOARD_WRAPPER, STORE_DASHBOARD_NUMBER } from 'reducers/dashboard.js';

describe('Reducer::Ui', function(){
  it('should handle MENU_TOGGLE', function(){
    const state = () => state;
    const initialState = { expandMenu: !state.expandMenu };
    const newState = uiReducer(initialState, {type: 'UI.MENU_TOGGLE'});
    expect(newState).to.eql({ expandMenu: !state.expandMenu});
  });

  it('should handle STORE_LOGIN_NUMBER', function(){
    const mockAction = {payload:{}};
    const state = { loginNumber:  mockAction.payload };
    const newState = uiReducer(state, {type: 'UI.STORE_LOGIN_NUMBER'});
    expect(newState).to.eql({ loginNumber: mockAction.payload });
  });

  it('should handle STORE_LOGIN_EMAIL', function(){
    const mockAction = {payload:{}};
    const state = { loginEmail: mockAction.payload };
    const newState = uiReducer(state, {type: 'UI.STORE_LOGIN_EMAIL'});
    expect(newState).to.eql({ loginEmail: mockAction.payload });
  });

  it('should handle STORE_SIGNUP_NUMBER', function(){
    const mockAction = {payload:{}};
    const state = { signupNumber: mockAction.payload };
    const newState = uiReducer(state, {type: 'UI.STORE_SIGNUP_NUMBER'});
    expect(newState).to.eql({ signupNumber: mockAction.payload });
  });

  it('should handle STORE_SIGNUP_EMAIL', function(){
    const mockAction = {payload:{}};
    const state = { signupEmail: mockAction.payload };
    const newState = uiReducer(state, {type: 'UI.STORE_SIGNUP_EMAIL'});
    expect(newState).to.eql({ signupEmail: mockAction.payload });
  });

  it('should handle DASHBOARD_WRAPPER', function(){
    const mockAction = {payload:{}};
    const state = { dashboardWrapper: mockAction.payload };
    const newState = uiReducer(state, {type: 'UI.DASHBOARD_WRAPPER'});
    expect(newState).to.eql({ dashboardWrapper: mockAction.payload });
  });

  it('should handle STORE_DASHBOARD_NUMBER', function(){
    const mockAction = {payload:{}};
    const state = { dashboardNumber: mockAction.payload };
    const newState = uiReducer(state, {type: 'UI.STORE_DASHBOARD_NUMBER'});
    expect(newState).to.eql({ dashboardNumber: mockAction.payload });
  });

  it('should handle EXPAND_LOGIN', function(){
    const state = { expandedLogin: true };
    const newState = uiReducer(state, {type: 'UI.EXPAND_LOGIN'});
    expect(newState).to.eql({ expandedLogin: true });
  });

  it('should handle COLLAPSE_LOGIN', function(){
    const state = { expandedLogin: false };
    const newState = uiReducer(state, {type: 'UI.COLLAPSE_LOGIN'});
    expect(newState).to.eql({ expandedLogin: false });
  });

  it('should handle SET_NOLAYOUT', function(){
    const mockAction = {payload:{}};
    const state = { nolayout: mockAction.payload };
    const newState = uiReducer(state, {type: 'UI.SET_NOLAYOUT'});
    expect(newState).to.eql({ nolayout: mockAction.payload });
  });
});
