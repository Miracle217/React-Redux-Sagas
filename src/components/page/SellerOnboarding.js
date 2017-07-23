import React, { Component } from 'react';
import { connect } from 'react-redux';
import SellerAddInfo from 'components/seller/SellerAddInfo';
import SellerReserveHashtag from 'components/seller/SellerReserveHashtag';
import SellerConnectionsDashboard from 'components/seller/SellerConnectionsDashboard';
import SellerPaymentMethod from 'components/seller/SellerPaymentMethod';
import SELLER from 'action-types/seller';
import buildAction from 'helpers/buildAction';
import { root } from 'app/routes';
import { Link } from 'react-router';

export class SellerOnboarding extends Component {
  constructor(props, context) {
    super(props, context);
    this.signOut = this.signOut.bind(this);
  }
  signOut(e){
    e.preventDefault();
    const {dispatch} = this.props;
    dispatch(buildAction(SELLER.LOGOUT));
  }

  render () {
    const { currentStep, account } = this.props;

    const logoutLink = account ? <Link to={root} onClick={this.signOut} > log out</Link> : null;

    var nav = (
      <div className="top-nav-bar stepped-nav">
        <nav className="top-bar" data-topbar role="navigation">
          <a className="logo" href="https://boo.st">
            <img src="/images/logo01.png" className="header-circle"/>
            <img src="/images/logo02.png" className="header-tag" />
          </a>
          <ul className="steps">
            <li className={this.props.currentStep === 1 ? 'on' : 'complete'}>
              <i /><div className="step-label">reserve hashtag</div>
            </li>
            <li className={this.props.currentStep > 2 ? 'complete' : (this.props.currentStep === 2 ? 'on' : '')}>
              <i /><div className="step-label">add info</div>
            </li>
            <li className={this.props.currentStep > 3 ? 'complete' : (this.props.currentStep === 3 ? 'on' : '')}>
              <i /><div className="step-label">set up payment method</div>
            </li>
            <li className={this.props.currentStep > 4 ? 'complete' : (this.props.currentStep === 4 ? 'on' : '')}>
              <i /><div className="step-label">connect and sell</div>
            </li>
            {this.props.currentStep > 2 ? <li className="seller-logout"> {logoutLink}</li> : null }
          </ul>
        </nav>
      </div>
    );

    let bodyData = null;
    if (currentStep === 1) {
      bodyData = (<SellerReserveHashtag />);
    } else if (currentStep === 2) {
      bodyData = (<SellerAddInfo />);
    } else if (currentStep === 3){
      bodyData = (<SellerPaymentMethod account={account} />);
    } else if (currentStep >= 4) {
      bodyData = (<SellerConnectionsDashboard />);
    }

    return (
      <div>
        {/* Modal: Add Product turn on the component below */}
        {/* <SellerAddProduct /> */}
        {nav}
        {bodyData}
      </div>
    );
  }
}

SellerOnboarding.defaultProps = {
  currentStep: 1
};

export default connect(state => ({
  currentStep: state.seller.currentStep,
  account: state.seller.account
}))(SellerOnboarding);
