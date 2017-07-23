import React from 'react';
import ReactTelInput from 'react-telephone-input';
import { Link } from 'react-router';
import InputText from 'components/common/InputText';
import buildAction from 'helpers/buildAction';
import SIGNUP from 'action-types/signup';
import { privacy } from 'app/routes';
import { connect } from 'react-redux';
import { onlyCountries, formatPhoneNumber, maybe } from 'helpers';
import { setRef } from 'helpers';

const SMS_NUMBER = 81000;

const CreateAccount = ({ui, user, branding, dispatch}) => {
  const refs = {};

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(buildAction(SIGNUP.CREATE_ACCOUNT));
  };

  const signupCopy = maybe(branding, 'product', 'signupMessage') || maybe(branding, 'account', 'signupMessage') || 'the easiest way to #buy what you see.';

  return (
  <div>
     <div className="header">
       <h1>{signupCopy}</h1>
     </div>
     <div>
       <form onSubmit={onSubmit} className="signup-form">
         <h6>get started with this number</h6>
          <InputText
            type="tel"
            value={formatPhoneNumber(ui.signupNumber)}
            disabled />
          <input className="form-button" type="submit" value="Create Account" />
          <p className="helper-text">Enter your phone number and click button above to sign up for Boost, Inc. service. Message and data rates may apply. 1 msgs/request Text HELP to {SMS_NUMBER} for help. Text STOP to {SMS_NUMBER} to cancel.</p>
          <p className="helper-text">By tapping "Create Account" above, you agree to the <Link to={privacy + '?nolayout=true'} target="_blank">Privacy Policy</Link> of Boost, Inc.</p>
       </form>
     </div>
     <div className="content">
       <h3>how does it work?</h3>
       <p>
         Sellers that use boost will post a special hashtag. Just mention it in your comment.
       </p>
    </div>
  </div>
  );
};

export default connect(state => ({
  user: state.user,
  branding: state.ui.hashtagBranding,
  ui: state.ui
}))(CreateAccount);
