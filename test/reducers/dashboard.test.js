import '../common';

import { expect } from 'chai';
import dashboardReducer from 'reducers/dashboard';
import DASHBOARD from 'action-types/dashboard';
import { CLEAR_MODALS, ADD_CARD_MODAL, EDIT_CARD_MODAL } from 'reducers/dashboard.js';


describe('Reducer::Dashboard', function(){

  it('should handle CLEAR_MODALS', function(){
    const state = {  addCardModal: false, editCardModal: false };
    const newState = dashboardReducer(state, {type: 'DASHBOARD.CLEAR_MODALS'});
    expect(newState).to.eql({addCardModal: false, editCardModal: false});
  });

  it('should handle ADD_CARD_MODAL', function(){
    const state = () => state;
    const initialState = { addCardModal: !state.addCardModal };
    const newState = dashboardReducer(initialState, {type: 'DASHBOARD.ADD_CARD_MODAL'});
    expect(newState).to.eql({ addCardModal: !state.addCardModal});
  });

  it('should handle EDIT_CARD_MODAL', function(){
    const state = () => state;
    const initialState = { addCardModal: !state.editCardModal };
    const newState = dashboardReducer(initialState, {type: 'DASHBOARD.EDIT_CARD_MODAL'});
    expect(newState).to.eql({ addCardModal: !state.editCardModal });
  });
});

