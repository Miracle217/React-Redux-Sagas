import React from 'react';
import { connect } from 'react-redux';
import buildAction from 'helpers/buildAction';
import ActionTypes from 'action-types/ui';

const Notification =  ({notification, index, removeNotification}) => {
  const onClose = (index, e) => {
    e.preventDefault();
    removeNotification(index);
  };
  return (
    <div  className={getNotificationClassName(notification)}>
      <span>{typeof notification === 'string' ? notification : notification.message}</span>
      <a href="#" onClick={onClose.bind(null, index)} className="close">×</a>
    </div>
  );
};

export default connect(state => ({}), dispatch => ({
  removeNotification: (index) => dispatch(buildAction(ActionTypes.REMOVE_NOTIFICATION, {index}))
}))(Notification);

function getNotificationClassName (notification) {
  return ['notification', 'alert-box'].concat(typeof notification === 'string' ? 'success' : (notification.level || 'success')).join(' ');
}
