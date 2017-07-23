import React from 'react';
import { connect } from 'react-redux';

import dynamicUrl from 'action-types/dynamicUrl';
import { buildAction } from 'helpers';

import Loading from 'components/page/LoadingPage';

const DynamicURL = ({route, dispatch}) => {
  return (
    <Loading />
  );
};

export default connect(state => ({
  route: state.routing
}), dispatch => ({
  dispatch: dispatch
}))(DynamicURL);
