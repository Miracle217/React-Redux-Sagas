
import React, { Component } from 'react';

import { Range as range } from 'immutable';

export default class YearSelector extends Component {

  state = {value: ''};

  componentWillMount () {
    this.setState({value: this.props.value});
  }

  get value () {
    return this.state.value;
  }

  set value (val) {
    this.setState({value: val});
  }

  onChange (e) {
    this.setState({value: e.target.value});
  }

  render () {
    const { startYear, endYear, input, meta, ...props } = this.props;
    return (
      <select {...props} {...input} onChange={this.onChange.bind(this)} value={this.state.value}>
        <option value="">Year</option>
        {range(startYear, endYear).map(year => <option key={year} value={year}>{year}</option>)}
      </select>
    );
  }
}
