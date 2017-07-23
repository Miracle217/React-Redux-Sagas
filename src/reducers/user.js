import USER from 'action-types/user';
import { handleActions } from 'redux-actions';

function setUser (state, action) {
  const {id, data} = action.payload;
  return {...state, id, data};
}

function updateUserData (state, action) {
  const data = Object.assign(state.data, action.payload);
  return {...state, data};
}

export default handleActions({
  [USER.CLEAR_TRIGGERED_EXPRESS]: (state, action) => ({...state, triggeredExpress: null }),
  [USER.TRIGGERED_EXPRESS]: (state, action) => ({...state, triggeredExpress: action.payload }),
  [USER.CHECKED]: state => ({...state, checked: true}),
  [USER.SET_USER]: setUser,
  [USER.UPDATE_USER_DATA]: updateUserData,
  [USER.LOGOUT]: state => ({...state, id: null, data: null}),
  [USER.SET_CARDS]: (state, action) => ({...state, cards: action.payload}),
  [USER.SET_DEFAULT_CARD]: (state, action) => ({...state, defaultCard: action.payload}),
  [USER.RECEIPTS_CHECKED]: state => ({...state, receiptsChecked: true}),
  [USER.SET_RECEIPTS]: (state, action) => ({...state, receipts: action.payload}),
  [USER.SET_CURRENT_RECEIPT]: (state, action) => ({...state, currentReceipt: action.payload})
}, {receiptsChecked: false});
