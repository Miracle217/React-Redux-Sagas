'use strict';
import React, { Component } from 'react';
import SELLER from 'action-types/seller';
import NotificationList from 'components/common/NotificationList';
import Loading from 'components/common/Loading';
import { connect } from 'react-redux';
import  classnames  from 'classnames';
import ReserveHashtagForm from 'components/form/seller/ReserveHashtag';

export class SellerReserveHashtag extends Component {

  render () {
    return (
      <div>
        <div className="header small">
          <h1><span className="deemphasize">let’s get you signed up for boost.</span> <br />first, reserve your hashtag!</h1>
        </div>
        <div className="form-container seller">
          <Loading />
          <NotificationList notifications={this.props.notifications} />
            <div className={classnames('signup-form')}>
              <h2>what's your company's name?</h2>
              <ReserveHashtagForm action={SELLER.STORE_SELLER_COMPANY} />
            </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  notification: state.ui.notifications
}))(SellerReserveHashtag);
