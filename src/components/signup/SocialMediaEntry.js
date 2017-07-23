'use strict';

import React from 'react';
import { connect } from 'react-redux';

import SIGNUP from 'action-types/signup';
import buildAction from 'helpers/buildAction';

const SocialMediaEntry = ({user, dispatchUsePhone, dispatchUseTwitter, dispatchUseInstagram}) => {
  return null;
  /*
  // not used
  const onUseInstagramClick = (e) => {
    e.preventDefault();
    dispatchUseInstagram();
  };
  const onUseTwitterClick = (e) => {
    e.preventDefault();
    dispatchUseTwitter();
  };
  const onUsePhoneClick = (e) => {
    e.preventDefault();
    dispatchUsePhone();
  };

  const instagramButton = <button onClick={onUseInstagramClick} className="form-button instagram-button"><i className="fa fa-instagram" />Instagram</button>;
  const twitterButton = <button onClick={onUseTwitterClick} className="form-button twitter-button"><i className="fa fa-twitter" />Twitter</button>;

  return (
    <div>
      <form id="socialForm" className="boost-app-form signup-form" >
        <h6>
          where did you hear about boost? <br />
          connect your account below
        </h6>
        {instagramButton}
        {twitterButton}
        <a href="#" onClick={onUsePhoneClick} className="form-button">I'll just use my phone for now</a>
      </form>
    </div>
  );
  */
};

export default connect(state => ({

}), dispatch => ({
  dispatchUsePhone: () => dispatch(buildAction(SIGNUP.USE_PHONE)),
  dispatchUseTwitter: () => dispatch(buildAction(SIGNUP.USE_TWITTER)),
  dispatchUseInstagram: () => dispatch(buildAction(SIGNUP.USE_INSTAGRAM))
}))(SocialMediaEntry);
