import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { formDispatcher } from 'helpers';

export class CompanyInfo extends Component {
  render () {
    const { handleSubmit, action } = this.props;
    return (
      <form className="no-padding" onSubmit={handleSubmit(formDispatcher(action))}>
        <input type="hidden" value="disableAutoFill"/>
        <Field component="input"  className="form-control" type="email" placeholder="email (customer service)" required     autoFocus name="email" />
        <Field component="input"  className="form-control" type="tel" placeholder="phone (customer service)" required name="phone" />
        <Field component="input" className="form-control" type="number" pattern="[0-9]*" inputMode="numeric" placeholder="company zip code" required name="postalCode" />
        <input type="submit" value="continue" className="form-button"  onClick={this.onClick}/>
      </form>
    );
  }
}

export default reduxForm({
  form: 'sellerCompanyInfo'
})(CompanyInfo);
