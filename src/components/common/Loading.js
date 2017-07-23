import React from 'react';
import {connect} from 'react-redux';

export const Loading = ({loading}) => loading ? (
  <div className="loading">
    <div className="spinner" />
  </div>
) : null;

export default connect(state => ({loading: state.ui.loading}))(Loading);
