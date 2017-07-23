'use strict';

import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { buildAction, setRef } from 'helpers';
import UI from 'action-types/ui';
import USER from 'action-types/user';
import SIGNUP from 'action-types/signup';
import { privacy } from 'app/routes';


const ConfirmationCodeEntry = ({ui, dispatch}) => {
  const refs = {};
  const onSubmit = (e) => {
    e.preventDefault();
    const code = refs.confirmationCodeInput.value;
    dispatch(buildAction(SIGNUP.CONFIRM_CODE, code));
  };
  const onResendClick = (e) => {
    e.preventDefault();
    dispatch(buildAction(SIGNUP.RESUBMIT_PHONE));
  };
  const onChangeNumberClick = (e) => {
    e.preventDefault();
    dispatch(buildAction(UI.STORE_SIGNUP_NUMBER, null));
    dispatch(buildAction(UI.CLEAR_NOTIFICATIONS));
    dispatch(buildAction(SIGNUP.STEP_CHECK));
  };
  return (
    <div>
      <form onSubmit={onSubmit} className="boost-app-form signup-form">
        <h6>enter confirmation code</h6>
        <input id="requestTokenField" ref={setRef(refs, 'confirmationCodeInput')} type="number" inputMode="numeric" pattern="[0-9]*" required="required" placeholder="Confirmation Code"/>
        <input className="form-button" type="submit" value="Create Account" />
        <a onClick={onChangeNumberClick} className="secondary-link">Send to a Different Number</a>
        <a onClick={onResendClick} className="secondary-link">Resend Confirmation Code</a>
        <p className="helper-text">By tapping "Create Account" above, you agree to the <Link to={privacy + '?nolayout=true'} target="_blank">Privacy Policy</Link> of Boost, Inc.</p>
      </form>
    </div>
  );
};

export default connect(state => ({
  ui: state.ui
}))(ConfirmationCodeEntry);
