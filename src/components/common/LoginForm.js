import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ReactTelInput from 'react-telephone-input';
import UI from 'action-types/ui';
import USER from 'action-types/user';
import { onlyCountries } from 'helpers/telInputHelper';
import { setRef, buildAction } from 'helpers';
import { emailLogin, signup } from 'app/routes';

import Loading from './Loading';
import NotificationList from './NotificationList';
import EmailLogin from './EmailLogin';

const LoginForm = ({ui, dispatch, dispatchPhoneLogin, dispatchPhoneLoginConfirm, dispatchTwitterLogin, dispatchInstagramLogin}) => {
  const refs = {};
  const onSubmit = (e) => {
    e.preventDefault();
    let number, confirmationCode;
    if (refs.number) {
      number = refs.number.getInstance().getValue();
    }
    if (refs.confirmationCode) {
      confirmationCode = refs.confirmationCode.value;
    }
    if (!number) {
      return false;
    }
    if (confirmationCode && number == ui.loginNumber) {
      dispatchPhoneLoginConfirm(number, confirmationCode);
    } else {
      dispatchPhoneLogin(number);
    }
  };

  const onResendClick = (e) => {
    if (!ui.expandedLogin) {
      return;
    }
    e.stopPropagation();
    const  number = refs.number.getInstance().getValue();
    if (!number) {
      dispatch(buildAction(UI.STORE_LOGIN_NUMBER, null));
      dispatch(buildAction(UI.COLLAPSE_LOGIN));
    }
    dispatchPhoneLogin(number);
  };

  const onChangeNumberClick = (e) => {
    if (!ui.expandedLogin) {
      return;
    }
    e.stopPropagation();
    dispatch(buildAction(UI.STORE_LOGIN_NUMBER, null));
    dispatch(buildAction(UI.COLLAPSE_LOGIN));
  };

  const confirmationCodeStyle = {display: ui.expandedLogin ? 'block' : 'none' };

  return (
    <form onSubmit={onSubmit} action="" className="phoneNumber" method="post" acceptCharset="utf-8">
      <div className="form-container">
      <div className="header">
        <h1>log in with your phone number</h1>
      </div>
        <Loading />
        <NotificationList notifications={ui.notifications} />
        <div className="signup-form">
          <div className={ui.expandedLogin ? 'hide' : ''}>
            <ReactTelInput
              ref={setRef(refs, 'number')}
              flagsImagePath="/images/flags.png"
              defaultCountry="us"
              placeholder="phone number"
              id="UserUsername"
              onlyCountries={onlyCountries}
              value={ui.loginNumber}
            />
          </div>
          <div className={ui.expandedLogin ? '' : 'hide'}>
            <input style={confirmationCodeStyle} ref={setRef(refs, 'confirmationCode')} type="number" inputMode="numeric"  pattern="[0-9]*" placeholder="Login Code" id="requestTokenField" />
          </div>
          <input type="submit" value={ui.expandedLogin ? 'log in' : 'send me a login code'} className="form-button"/>
          <div className="text-center">
            <Link className="secondary-link" onClick={onResendClick} to={ui.expandedLogin ? '#' : emailLogin}>{ui.expandedLogin ? 'Resend login code' : 'log in with email'}</Link>
            <Link className="secondary-link" onClick={onChangeNumberClick} to={ui.expandedLogin ? '#' : signup}>{ui.expandedLogin ? 'Send to a different number' : 'sign up'}</Link>
          </div>
          <p className="helper-text">Message and data rates may apply. 1 msgs/request Text HELP to 81000 for help. Text STOP to 81000 to cancel.</p>
        </div>
      </div>
    </form>
  );
};

export default connect(state => ({
  ui: state.ui
}), dispatch => ({
  dispatch: dispatch,
  dispatchPhoneLogin: (number) => dispatch(buildAction(USER.PHONE_LOGIN, {number})),
  dispatchPhoneLoginConfirm: (number, code) => dispatch(buildAction(USER.PHONE_LOGIN_CONFIRM, {number, code})),
  dispatchInstagramLogin: () => dispatch(buildAction(USER.INSTAGRAM_LOGIN)),
  dispatchTwitterLogin: () => dispatch(buildAction(USER.TWITTER_LOGIN))
}))(LoginForm);
