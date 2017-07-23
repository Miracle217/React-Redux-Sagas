import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTelInput from 'react-telephone-input';
import CHECKOUT from 'action-types/checkout';
import { onlyCountries } from 'helpers';
import NotificationList from 'components/common/NotificationList';
import Loading from 'components/common/Loading';


const SMS_NUMBER = 81000;
class CheckoutUser extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = { mobileNumber: '', isPhoneExist: false, formSubmitted: false};

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    this.setState({isPhoneExist: nextProps.isPhoneExist, formSubmitted: nextProps.formSubmitted});
  }

  onChange = (e) => {
    this.setState({
      mobileNumber: e
    });
  };

  onConfirm = (e) => {
    const {dispatch} = this.props;
    dispatch({ type: CHECKOUT.SUBMIT_NUMBER, mobileNumber: this.state.mobileNumber, confirmationRequired: false, isPhoneExist: true });
  };

  onCancel = (e) => {
    this.setState({
      isPhoneExist: false,
      formSubmitted: false
    });
  };

  onSubmit= (e) => {
    e.preventDefault();
    const {dispatch} = this.props;
    dispatch({ type: CHECKOUT.SUBMIT_NUMBER, mobileNumber: this.state.mobileNumber, confirmationRequired: true, isPhoneExist: false });
  };

  render() {
    const formData = (<div className="phoneNumber">
        <div className="form-container">
          <div className="header"><h3>the best way to buy what you see.</h3></div>
          <div>
            <form onSubmit={this.onSubmit} className="signup-form">
              <h6>register your number to get started</h6>
              <ReactTelInput
              ref="number"
              onChange={this.onChange}
              value={this.state.mobileNumber}
              flagsImagePath="/images/flags.png"
              defaultCountry="us"
              onlyCountries={onlyCountries}
              autocompleteAction={CHECKOUT.AUTOCOMPLETE}/>
              <input className="form-button" type="submit" value="Register" />
              <p className="helper-text">Enter your phone number and click button above to sign up for Boost, Inc. service. Message and data rates may apply. 1 msgs/request Text HELP to {SMS_NUMBER} for help. Text STOP to {SMS_NUMBER} to cancel.</p>
            </form>
          </div>
          <div className="content">
            <h3>How Does It Work?</h3>
            <p>
              When your favorite brands post a product on Facebook, Instagram or Twitter comment, tweet or text their Boost #hashtag to buy INSTANTLY. It'll ship and be on your doorstep within days! Kinda crazy, right? We know!
              <br/><br/>
              See It. Want It. Boost It.ReactTelInput
            </p>
          </div>
        </div>
      </div>);

    const thanksData = (<div className="phoneNumber">
        <div className="form-container">
          <div className="header">
              Thanks!
            <p>Please check your mobile for details on how to finish your transaction</p>
          </div>
        </div>
      </div>);

    const confirmationMessage = (<div className="phoneNumber">
        <div className="form-container">
          <div className="header"><h3>{this.state.mobileNumber}: already exist click yes to continue</h3></div>
          <div className="signup-form">
            <input className="form-button" type="button" onClick={this.onCancel} value="No" />
            <input className="form-button" type="button" onClick={this.onConfirm} value="YES" />
          </div>
        </div>
      </div>);

    const confirmationNotification = (<div className="phoneNumber">
        <div className="header"><h3> Confirmation sent!</h3>
          <p> Confirmation sent to your phone. Login to your dashboard and associate your twitter account to make this even easier!</p>
        </div>
      </div>);

    return (
      <div>
        <div>
          <div className="header"><NotificationList notifications={this.props.notifications} /></div>
          <Loading />
          {this.state.isPhoneExist ? (this.state.formSubmitted ? confirmationNotification : confirmationMessage) : (this.state.formSubmitted ? thanksData : formData)}
          }
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  notifications: state.ui.notifications,
  isPhoneExist: state.checkout.isPhoneExist,
  formSubmitted: state.checkout.formSubmitted
}))(CheckoutUser);
