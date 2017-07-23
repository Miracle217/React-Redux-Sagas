import DASHBOARD from 'action-types/dashboard';
import { handleActions } from 'redux-actions';


export default handleActions({
  [DASHBOARD.CLEAR_MODALS]: state => ({...state, addCardModal: false, editCardModal: false}),
  [DASHBOARD.ADD_CARD_MODAL]: state => ({...state, addCardModal: !state.addCardModal}),
  [DASHBOARD.EDIT_CARD_MODAL]: (state, action) => ({...state, editCardModal: !state.editCardModal, currentCardId: action.payload})
}, {});
