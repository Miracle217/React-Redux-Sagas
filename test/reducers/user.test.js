import '../common';

import { expect } from 'chai';
import USER from 'action-types/user';
import { CHECKED, LOGOUT, SET_CARDS, SET_DEFAULT_CARD } from 'reducers/dashboard.js';
import userReducer from 'reducers/user';

describe('Reducer::User', function(){

  it('should handle CHECKED', function(){
    const state = { checked: true };
    const newState = userReducer(state, {type: 'USER.CHECKED'});
    expect(newState).to.eql({ checked: true });
  });

  it('should handle LOGOUT', function(){
    const state = { id: null, data: null };
    const newState = userReducer(state, {type: 'USER.LOGOUT'});
    expect(newState).to.eql({ id: null, data: null });
  });

  it('should handle SET_CARDS', function(){
    const mockAction = {payload:{}};
    const state = { cards: mockAction.payload };
    const newState = userReducer(state, {type: 'USER.SET_CARDS'});
    expect(newState).to.eql({ cards: mockAction.payload });
  });

  it('should handle SET_DEFAULT_CARD', function(){
    const mockAction = {payload:{}};
    const state = { defaultCard: mockAction.payload };
    const newState = userReducer(state, {type: 'USER.SET_DEFAULT_CARD'});
    expect(newState).to.eql({ defaultCard: mockAction.payload });
  });

  it('should handle SET_RECEIPTS', function(){
    const mockAction = {payload:{}};
    const state = { receipts: mockAction.payload };
    const newState = userReducer(state, {type: 'USER.SET_RECEIPTS'});
    expect(newState).to.eql({ receipts: mockAction.payload });
  });

  it('should handle RECEIPTS_CHECKED', function(){
    const state = { receiptsChecked: true };
    const newState = userReducer(state, {type: 'USER.RECEIPTS_CHECKED'});
    expect(newState).to.eql({ receiptsChecked: true });
  });

  it('should handle SET_CURRENT_RECEIPT', function(){
    const mockAction = {payload:{}};
    const state = { currentReceipt: mockAction.payload };
    const newState = userReducer(state, {type: 'USER.SET_CURRENT_RECEIPT'});
    expect(newState).to.eql({ currentReceipt: mockAction.payload });
  });
});
