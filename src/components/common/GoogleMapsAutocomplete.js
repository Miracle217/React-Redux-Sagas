import React, { Component } from 'react';
import { buildAction,  initAutocomplete } from 'helpers';
import { connect } from 'react-redux';

export class GoogleMapsAutocomplete extends Component {
  componentDidMount () {
    const { dispatch, action } = this.props;
    initAutocomplete(this.refs.input)
      .then(autocomplete =>
        autocomplete.on('autocomplete', args =>
          dispatch(buildAction(action, args))
        )
      );
  }

  render () {
    const {action, dispatch, input, meta, ...props} = this.props;
    return (
      <input {...props} {...input} ref="input" />
    );
  }
}

export default connect()(GoogleMapsAutocomplete);
