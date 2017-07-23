import React from 'react';
import { connect } from 'react-redux';
import Loading from 'components/common/Loading';

const LoadingPage = ({loadingMessage}) => (
    <article>
      <div className="row product-head">
        <h4 className="text-center">{loadingMessage}</h4>
        <div className="loading-page-area">
          <Loading />
        </div>
      </div>
    </article>
);

export default connect(state => ({
  loadingMessage: state.ui.loadingMessage
}))(LoadingPage);
