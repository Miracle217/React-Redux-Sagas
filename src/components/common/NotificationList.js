import React from 'react';
import { connect } from 'react-redux';
import Notification from './Notification';

const NotificationList = ({filter, nofilter, notifications}) => {
  if (filter) {
    notifications = notifications.filter(notification => typeof notification === 'object' && notification.filter === filter);
  } else if (nofilter) {
    notifications = notifications.filter(notification => typeof notification !== 'object' || !notification.filter);
  }
  return (
    <div>
      {notifications.map((notification, index) => <Notification key={index} notification={notification} index={index} />)}
    </div>
  );
};

export default connect(state => ({
  notifications: state.ui.notifications
}))(NotificationList);
