import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { formDispatcher } from 'helpers';

export class ReserveHashtag extends Component {
  render () {
    const { handleSubmit, action } = this.props;
    return (
      <form className="no-padding" onSubmit={handleSubmit(formDispatcher(action))}>
        <input type="hidden" value="disableAutoFill"/>
        <Field component="input" className="form-control"
         type="text" placeholder="acme co."
         name="companyName"
         required autoFocus autoComplete="off" />
         {/*this.state.error && <span className="help-block">{this.state.error}</span>*/}
        <input type="submit" value="reserve hashtag" className="form-button" />
      </form>
    );
  }
}

export default reduxForm({
  form: 'sellerReserveHashtag'
})(ReserveHashtag);
