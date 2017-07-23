import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { dashboard } from 'app/routes';
import { onlyCountries } from 'helpers/telInputHelper';
import ReactTelInput from 'react-telephone-input';
import { setRef, buildAction } from 'helpers';
import USER from 'action-types/user';
import UI   from 'action-types/ui';
import Loading from '../common/Loading';
import NotificationList from '../common/NotificationList';

function TriggerExpressPage({ui, user, dispatch}) {

  const refs = {};
  const hashtagText = ui.route.params.hashtag;
  const hashtag = ui.hashtag || {};

  if (!hashtag.loaded) {
    dispatch(buildAction(UI.LOAD_HASHTAG, {hashtag: hashtagText}));
  }

  const productTitle = hashtag.product ? hashtag.product.title : `#${hashtagText}`;

  function onSubmit(e) {
    e.preventDefault();
    let number;
    if (refs.number) number = refs.number.getInstance().getValue();
    if (user.triggeredExpress) number = user.triggeredExpress.number;
    if (!number) return false;
    dispatch(buildAction(USER.TRIGGER_EXPRESS, {number, hashtag: hashtagText}));
  }

  function clearTriggeredExpress(e) {
    dispatch(buildAction(USER.CLEAR_TRIGGERED_EXPRESS));
  }

  const triggerExpressCheckoutForm = (
    <div className="signup-form">
      <div className={ui.expandedLogin ? 'hide' : ''}>
        <h6>enter your mobile number</h6>
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
      <input type="submit" value="send link" className="form-button"/>
      <p className="helper-text">Message and data rates may apply. 1 msgs/request Text HELP to 81000 for help. Text STOP to 81000 to cancel.</p>
    </div>
  );

  const triggerExpressCheckoutAgain = (
    <div className="signup-form">
      <div><h6>check your phone</h6></div>
      <input type="submit" value="send link again" className="form-button"/>
      <p className="helper-text"><a onClick={clearTriggeredExpress}>enter a different number?</a></p>
    </div>
  );

  return (
    <div>
      <form onSubmit={onSubmit} action="" className="phoneNumber" method="post" acceptCharset="utf-8">
        <div className="form-container">
          <div className="header">
            <h6 className="subheader-dark">get your checkout link for</h6>
            <h1>{productTitle}</h1>
          </div>

          <Loading />
          <NotificationList notifications={ui.notifications} />
          {user.triggeredExpress ? triggerExpressCheckoutAgain : triggerExpressCheckoutForm}
        </div>
      </form>
    </div>
  );
}

export default connect(state => ({
  ui: state.ui,
  user: state.user
}), dispatch => ({
  dispatch
}))(TriggerExpressPage);
