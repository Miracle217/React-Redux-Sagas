import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { formDispatcher } from 'helpers';

export class LoginInfo extends Component {
  render () {
    const { handleSubmit, action } = this.props;
    return (
      <form className="no-padding" onSubmit={handleSubmit(formDispatcher(action))}>
        <input type="hidden" value="disableAutoFill"/>
        <Field component="input" className="form-control" type="text" placeholder="first name"  required autoFocus
         name="firstName" />
        <Field component="input"  className="form-control" type="text" placeholder="last name" required
         name="lastName" />
        <Field component="input"  className="form-control" type="email" placeholder="example@gmail.com" required
         name="email" />
        <Field component="input"  className="form-control" type="password" placeholder="password" required
         name="password" />
        <input type="submit" value="continue" className="form-button" />
      </form>
    );
  }
}

export default reduxForm({
  form: 'sellerLoginInfo'
})(LoginInfo);
