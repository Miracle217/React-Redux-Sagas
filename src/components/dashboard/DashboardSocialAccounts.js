import React from 'react';
import { connect } from 'react-redux';
import Loading from 'components/common/Loading';
import NotificationList from 'components/common/NotificationList';
import USER from 'action-types/user';
import DASHBOARD from 'action-types/dashboard';
import buildAction from 'helpers/buildAction';

const DashboardSocialAccounts = ({user, dispatch}) => {
  const onInstagramConnect = e => {
    e.preventDefault();
    dispatch(buildAction(DASHBOARD.INSTAGRAM_CONNECT));
  };
  const onInstagramRemove = e => {
    e.preventDefault();
    dispatch(buildAction(DASHBOARD.REMOVE_INSTAGRAM));
  };
  const onTwitterConnect = e => {
    e.preventDefault();
    dispatch(buildAction(DASHBOARD.TWITTER_CONNECT));
  };
  const onTwitterRemove = e => {
    e.preventDefault();
    dispatch(buildAction(DASHBOARD.REMOVE_TWITTER));
  };
  const onFacebookConnect = e => e.preventDefault();
  const onFacebookRemove = e => e.preventDefault();

  return (
    <section className="setting-block">
      <Loading />
      <NotificationList filter="socialMedia" />
      <div className="setting-block-inner">
        <a name="social">
          <h3>connected accounts</h3>
        </a>
        <div className="accounts">
          <div className="account">
            {user.instagramAuth ? (
              <div className="row account">
                <div className="small-6 columns social-title">
                  Instagram <br />
                  <span>@{user.instagramAuth.username}</span>
                </div>
                <div className="small-6 columns account-action"><a onClick={onInstagramRemove} title="remove">Remove</a></div>
              </div>
            ) : (
              <div className="row account">
                <div className="small-6 columns social-title">Instagram <br /></div>
                <div className="small-6 columns account-action"><a onClick={onInstagramConnect} title="remove">Connect</a></div>
              </div>
            )}
          </div>
          <div className="account">
            {user.twitterAuth ? (
              <div className="row account">
                <div className="small-6 columns social-title">
                  Twitter <br />
                  <span>@{user.twitterAuth.username}</span>
                </div>

                <div className="small-6 columns account-action"><a onClick={onTwitterRemove} title="remove">Remove</a></div>
              </div>
            ) : (
              <div className="row account">
                <div className="small-6 columns social-title">Twitter <br /></div>
                <div className="small-6 columns account-action"><a onClick={onTwitterConnect}>Connect</a></div>
              </div>
            )}
          </div>
          <div className="hidden account">
            {user.facebookAuth ? (
              <div className="row account">
                <div className="small-6 columns social-title">Facebook <br /></div>
                <div className="small-6 columns">@{user.facebookAuth.username}</div>
                <div className="small-6 columns"><a onClick={onFacebookRemove} title="remove">Remove</a></div>
              </div>
            ) : (
              <div className="row account">
                <div className="small-6 columns social-title">Facebook <br /></div>
                <div className="small-6 columns">Coming Soon</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};


export default connect()(DashboardSocialAccounts);
