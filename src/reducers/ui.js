import UI from 'action-types/ui';
import { handleActions } from 'redux-actions';

function removeNotification (state, action) {
  const notifications = state.notifications.concat();
  notifications.splice(action.index, 1);
  return {...state, notifications: notifications};
}

function blankMessage (state, action) {
  const {title, message} = action.payload;
  return {...state, title, message};
}

function addNotification (state, action) {
  let notification = action.payload;
  if (typeof notification === 'string') {
    notification = {message: notification, level: 'success'};
  }
  if (notification) {
    return {...state, notifications: state.notifications.concat(notification)};
  }
  return state;
}

export default handleActions({
  [UI.LOAD_START]: state => ({...state, loading: true}),
  [UI.LOAD_END]: state => ({...state, loading: false}),
  [UI.LOADED_HASHTAG]: (state, action) => ({...state, hashtag: { loaded: true, ...action.payload} }),
  [UI.MENU_TOGGLE]: state => ({...state, expandMenu: !state.expandMenu}),
  [UI.SET_POWERED_BY]: (state, { payload }) => ({...state, poweredBy: payload}),
  [UI.LOADING_MESSAGE]: (state, action) => ({...state, loadingMessage: action.payload}),
  [UI.STORE_LOGIN_NUMBER]: (state, action) => ({...state, loginNumber: action.payload}),
  [UI.STORE_LOGIN_EMAIL]: (state, action) => ({...state, loginEmail: action.payload}),
  [UI.STORE_SIGNUP_NUMBER]: (state, action) => ({...state, signupNumber: action.payload}),
  [UI.STORE_SIGNUP_KEY]: (state, action) => ({...state, signupKey: action.payload}),
  [UI.STORE_SIGNUP_EMAIL]: (state, action) => ({...state, signupEmail: action.payload}),
  [UI.DASHBOARD_WRAPPER]: (state, action) => ({...state, dashboardWrapper: action.payload}),
  [UI.SET_HASHTAG_BRANDING]: (state, action) => ({...state, hashtagBranding: action.payload}),
  [UI.STORE_DASHBOARD_NUMBER]: (state, action) => ({...state, dashboardNumber: action.payload}),
  [UI.EXPAND_LOGIN]: state => ({...state, expandedLogin: true}),
  [UI.COLLAPSE_LOGIN]: state => ({...state, expandedLogin: false}),
  [UI.ADD_NOTIFICATION]: addNotification,
  [UI.REMOVE_NOTIFICATION]: removeNotification,
  [UI.BLANK_MESSAGE]: blankMessage,
  [UI.CLEAR_NOTIFICATIONS]: state => ({...state, notifications: []}),
  [UI.SET_NOLAYOUT]: (state, action) => ({...state, nolayout: action.payload}),
  [UI.ROUTE_MOUNTED]: (state, action) => ({...state, route: {params: action.payload.params, location: action.payload.location}})
}, {});
