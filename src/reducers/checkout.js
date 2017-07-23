import CHECKOUT from 'action-types/checkout';
import { handleActions } from 'redux-actions';

export default handleActions({
  [CHECKOUT.CHECKOUT_PARAMS]: (state, {payload}) => ({...state, checkoutParams: {...state.checkoutParams, ...payload}}),
  [CHECKOUT.ERROR]: (state, {payload}) => ({ ...state, error: payload }),
  [CHECKOUT.NUMBER_CONFIRMATION]: (state, action) => ({ ...state, isPhoneExist: action.payload.isPhoneExist, formSubmitted: action.payload.formSubmitted }),
  [CHECKOUT.SUBMIT_CHECKOUT_FORM]: (state, action) => ({ ...state, isPhoneExist: action.payload.isPhoneExist, formSubmitted: true})
}, {checkoutParams: {}});
