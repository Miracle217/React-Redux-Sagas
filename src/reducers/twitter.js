import TWITTER from 'action-types/twitter';
import { handleActions } from 'redux-actions';

export default handleActions({
  [TWITTER.OPTOUT_PARAMS]: (state, {payload}) => ({...state, optoutParams: {...state.params, ...payload}})
}, {optoutParams: {}});

