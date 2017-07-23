import React from 'react';
import { connect } from 'react-redux';
import buildAction from 'helpers/buildAction';
import UI from 'action-types/ui';

export const RouteDispatcher = ({children, params, location, dispatch}) => {
  dispatch(buildAction(UI.ROUTE_MOUNTED, {params, location}));
  return children;
};

export default connect()(RouteDispatcher);
