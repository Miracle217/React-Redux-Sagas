import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTelInput from 'react-telephone-input';
import CHECKOUT from 'action-types/checkout';

class confirmationMessage extends Component {

  constructor(props, context) {
    super(props, context);

    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    return (
      <div className="phoneNumber">
        <div className="form-container">
          <div className="header"><h1>Mobile number already exist.Enter YES to continue </h1></div>
        <div />
          <input className="form-button" type="button" onClick={this.onCancel} value="No" />
          <input className="form-button" type="button" onClick={this.onSubmit} value="YES" />
        </div>
      </div>
    );
  }
}

export default connect()(confirmationMessage);
