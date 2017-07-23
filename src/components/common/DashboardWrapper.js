import React from 'react';
import { connect } from 'react-redux';
import DashboardTabs from 'components/common/DashboardTabs';
import DASHBOARD from 'action-types/dashboard';
import buildAction from 'helpers/buildAction';
import UI from 'action-types/ui';
import USER from 'action-types/user';

function getName(user) {
  if (!user) {
    return null;
  }
  if (user.twitterAuth) {
    return user.twitterAuth.screen_name;
  }
  if (user.instagramAuth) {
    return user.instagramAuth.username;
  }
  if (user.mailingAddress) {
    return user.mailingAddress.firstName;
  }
}

const TWITTER_LINK = 'https://twitter.com/boost/status/745254969364733954';
const INSTAGRAM_LINK = 'https://www.instagram.com/p/BG59pHMOoJd/?taken-by=boost';
const IMAGE_URL = 'https://dz0sp0hq2m5w.cloudfront.net/t-shirt.png';


function twitterContent(user) {
  return (
    <div>
      <div className="feature-image">
        <a href={TWITTER_LINK}>
          <img src={IMAGE_URL} title="Get this shirt for $1!" alt="Get this shirt for $1!" />
        </a>
      </div>
      <div className="feature-message">
        <div className="header">
          <h6>Welcome {getName(user)}, <br />celebrate our launch with us!</h6>
          <h1>get our t-shirt for $1</h1>
          <a href={TWITTER_LINK} className="form-button twitter-button"><i className="fa fa-twitter" /> buy on twitter</a>
        </div>
        <div className="content">
          <h3>how does it work?</h3>
          <p>
             Sellers that use boost will post a special hashtag. Just mention it in your tweet.
          </p>
        </div>
      </div>
    </div>
  );
}

function instagramContent(user) {
  return (
    <div>
      <div className="feature-image">
        <a href={INSTAGRAM_LINK}>
          <img src={IMAGE_URL} title="Get this shirt for $1!" alt="Get this shirt for $1!" />
        </a>
      </div>
      <div className="feature-message">
        <div className="header">
          <h6>Welcome {getName(user)}, <br />celebrate our launch with us!</h6>
          <h1>get our t-shirt for $1</h1>
          <a href={INSTAGRAM_LINK} className="form-button instagram-button"><i className="fa fa-instagram" /> buy on instagram</a>
        </div>
        <div className="content">
          <h3>how does it work?</h3>
          <p>
            Sellers that use boost will post a special hashtag. Just mention it in your comment.
          </p>
        </div>
      </div>
    </div>
  );
}

function phoneContent(user) {
  return (
    <div>
      <div className="feature-image">
        <img src={IMAGE_URL} title="Get this shirt for $1!" alt="Get this shirt for $1!" />
      </div>
      <div className="feature-message">
        <div className="header">
          <h6>Welcome {getName(user)}, <br />celebrate our launch with us!</h6>
          <h1>get our t-shirt for $1</h1>
          <p className="standout">text <strong>#boost001</strong> to <strong>81000</strong> to purchase</p>
        </div>
        <div className="content">
          <h3>how does it work?</h3>
          <p>
            Sellers that use boost will post a special hashtag. Just text the hashtag to <strong>81000</strong> to buy. Connect to Twitter or Instagram for even more buying power.
          </p>
        </div>
      </div>
    </div>
  );
}

function dashboardWrapperContent (user, dashboardWrapper) {
  if (dashboardWrapper == 'twitter') {
    return twitterContent(user);
  }
  if (dashboardWrapper == 'instagram') {
    return instagramContent(user);
  }
  if (dashboardWrapper == 'phone') {
    return phoneContent(user);
  }
}

const DashboardWrapper = ({subtitle, selected, children, dispatch, user}) => {
  const dashboardWrapper = user && (user.instagramId ? 'instagram' : user.twitterId ? 'twitter' : 'phone');
  // disabling the t-shirt for now
  return (
    <main>
      <div className="row feature">
        {/*dashboardWrapperContent(user, dashboardWrapper)*/}
      </div>
      <div className="dash-outer">
        <div className="dash-wrapper">
          <DashboardTabs selected={selected} />
            <div className="dash-container boost-app-form small-inputs">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default connect(state => ({
  user: state.user && state.user.data
}))(DashboardWrapper);
