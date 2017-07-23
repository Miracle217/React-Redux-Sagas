import React from 'react';
import ReactTelInput from 'react-telephone-input';
import buildAction from 'helpers/buildAction';
import SIGNUP from 'action-types/signup';
import { connect } from 'react-redux';
import { onlyCountries, maybe } from 'helpers';
import { setRef } from 'helpers';

const SMS_NUMBER = 81000;

const PhoneNumberEntry = ({user, branding, dispatchSubmitPhone}) => {
  const refs = {};

  const onSubmit = (e) => {
    e.preventDefault();
    const number = refs.phoneNumber.getInstance().getValue();
    dispatchSubmitPhone(number);
  };

  const signupCopy = maybe(branding, 'product', 'signupMessage') || maybe(branding, 'account', 'signupMessage') || 'the easiest way to #buy what you see.';

  return (
  <div>
     <div className="header">
       <h1>{signupCopy}</h1>
     </div>
     <div>
       <form onSubmit={onSubmit} className="signup-form">
         <h6>register your number to get started</h6>
         <ReactTelInput
          ref={setRef(refs, 'phoneNumber')}
          value={user.mobileNumber}
          flagsImagePath="/images/flags.png"
          defaultCountry="us"
          onlyCountries={onlyCountries} />
         <input className="form-button" type="submit" value="Text Me Confirmation Code" />
         <p className="helper-text">Enter your phone number and click button above to sign up for Boost, Inc. service. Message and data rates may apply. 1 msgs/request Text HELP to {SMS_NUMBER} for help. Text STOP to {SMS_NUMBER} to cancel.</p>
       </form>
     </div>
     <div className="content">
       <h3>How Does It Work?</h3>
       <p>
        When your favorite brands post a product on Facebook, Instagram or Twitter comment, tweet or text their Boost #hashtag to buy INSTANTLY. It'll ship and be on your doorstep within days! Kinda crazy, right? We know!
        <br/><br/>
        See It. Want It. Boost It.
       </p>
    </div>
  </div>
  );
};

export default connect(state => ({
  user: state.user,
  branding: state.ui.hashtagBranding
}), dispatch => ({
  dispatchSubmitPhone: number => dispatch(buildAction(SIGNUP.SUBMIT_PHONE, number))
}))(PhoneNumberEntry);
