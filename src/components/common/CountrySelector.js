'use strict';

import React, { PropTypes } from 'react';

export default class CountrySelector extends React.Component {
  state = {value: ''};

  get value () {
    return this.state.value || 'US';
  }

  set value (val) {
    this.setState({value: val});
  }

  componentWillMount() {
    this.setState({value: this.props.defaultValue || this.props.value});
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value != this.props.value) {
      this.setState({value: nextProps.value});
    }
  }

  onChange (e) {
    this.setState({value: e.target.value});
  }

  render () {
    const { input, meta, ...props } = this.props;
    return (
      <select {...props} onChange={this.onChange.bind(this)} value={this.state.value} >
        <option value="US">United States</option>
      </select>
    );
  }
}
