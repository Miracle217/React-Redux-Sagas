'use strict';
import React, { Component } from 'react';
import SELLER from 'action-types/seller';
import { connect } from 'react-redux';
import NotificationList from 'components/common/NotificationList';
import Loading from 'components/common/Loading';
import LoginInfoForm from 'components/form/seller/LoginInfo';
import CompanyInfoForm from 'components/form/seller/CompanyInfo';

export class SellerAddInfo extends Component {

  render () {

    const hashtagReadout = (
      <div>
      <div className="hashtag-breakdown">
        <div className="hash">
          <span className="hash-header">
            your hashtag prefix
          </span>
          <span className="hashtag">#{this.props.prefix}</span>
        </div>
        <div className="hash hash-unique">
          <span className="hash-header">
            unique product no.
          </span>
          <span className="hashtag">001</span>
        </div>
      </div>
      <div className="hashtag-caption">
        <strong>Don’t like your hashtag?</strong> Don’t worry, you can change it once you’re set up.
      </div>
    </div>
  );

    var formStepIndicator = (
      <ul className="steps form-step">
        <li className={this.props.currentInfoStep === 1 ? 'on' : 'complete'}>you</li>
        <li className={this.props.currentInfoStep === 2 ? 'on' : ''}>your company</li>
      </ul>
    );

    var loginForm = (
      <div>
        <p className="helper-text">
          Add your administrator info. You can add other collaborators later.
          </p>
          <LoginInfoForm action={SELLER.STORE_SELLER_LOGIN_INFO} />
      </div>
    );

    var companyForm =  (
      <div>
        <p className="helper-text">
          Give us some details about your company so we can set up your tax info and customer communication.
          </p>
          <CompanyInfoForm action={SELLER.STORE_SELLER_COMPANY_INFO} />
      </div>
    );

    return (
     <div>
        {hashtagReadout}
        <div className="form-container seller">
          <Loading />
          <NotificationList notifications={this.props.notifications} />
          <div className="signup-form">
              {formStepIndicator}
              {this.props.currentInfoStep === 1 ? loginForm : companyForm}
          </div>
        </div>
      </div>
    );
  }
}

SellerAddInfo.defaultProps = {
  currentInfoStep: 1
};

export default connect(state => ({
  notification: state.ui.notifications,
  prefix: state.seller.prefix,
  currentInfoStep: state.seller.currentInfoStep
}))(SellerAddInfo);
