import React from 'react';
import { connect } from 'react-redux';
import { buildAction } from 'helpers';
import TWITTER from 'action-types/twitter';

export const TwitterOptOutPage = ({ dispatch, optoutParams: params}) => params.checking ?
(
  <article>
    <div className="header">
      <h1>checking twitter opt out status ...</h1>
    </div>
  </article>
) : params.error ? (
  <article>
    <div className="header">
      <h1>Error</h1>
    </div>
    <div className="form-container">
      <p className="helper-text">
        {params.error}
      </p>
    </div>
  </article>
) : params.processing ? (
  <article>
    <div className="header">
      <h1>processing your request ...</h1>
    </div>
  </article>
) : params.complete ? (
  <article>
    <div className="header">
      <h1>you have successfully opted {params.optedOut ? 'out of' : 'in to'} twitter messages</h1>
    </div>
  </article>
) : (
  <article>
    <div className="header">
      <h1>{params.optedOut ? 'opt in to twitter messages' : 'opt out of twitter messages'}</h1>
    </div>
    <div className="form-container">
      <p className="helper-text">
      {
        params.optedOut ? (
          'You are currently opted out of receiving Twitter notifications from Boost. Click the button to start receiving Boost notifications from Twitter.'
        ) : (
          'You are currently receiving Twitter notifications from Boost. Click the button to stop receiving Boost notifications from Twitter.'
        )
      }
      </p>
      <div className="text-center">
        <a className="form-button" onClick={() => dispatch(buildAction(TWITTER.REQUEST_OPTOUT, {code: params.code, twitterId: params.twitterId, optOut: !params.optedOut}))}>{params.optedOut ? 'Opt In' : 'Opt Out'}</a>
      </div>
    </div>
  </article>
);

export default connect(state => ({
  optoutParams: state.twitter.optoutParams
}))(TwitterOptOutPage);
