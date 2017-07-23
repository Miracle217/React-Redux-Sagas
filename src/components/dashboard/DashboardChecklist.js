import React from 'react';
import { connect } from 'react-redux';
import Loading from 'components/common/Loading';
import NotificationList from 'components/common/NotificationList';
import USER from 'action-types/user';
import DASHBOARD from 'action-types/dashboard';
import buildAction from 'helpers/buildAction';
import classNames from 'classnames';


export const DashboardChecklist = ({user, cards}) => {
  classNames('complete', 'hide');

  return (
    <div className={classNames('checklist', {hide: user.emailVerified && (user.instagramAuth && user.twitterAuth) && cards.length > 0 })} >
      <Loading />
      <h3>your setup</h3>
      <ul>
        <li className={classNames({complete: user.emailVerified})}>
          <i className="fa fa-check" />
          <a href="#email">Verify email</a>
        </li>
        <li className={classNames({complete: user.instagramAuth && user.twitterAuth})}>
          <i className="fa fa-check" />
          <a href="#social">Connect all your social accounts</a>
        </li>
        <li className={classNames({complete: cards.length > 0 })}>
          <i className="fa fa-check" />
          <a href="#payment">Add credit card</a>
        </li>
      </ul>
    </div>
  );
};

export default connect(state => ({
  cards: state.user.cards || []
}))(DashboardChecklist);

