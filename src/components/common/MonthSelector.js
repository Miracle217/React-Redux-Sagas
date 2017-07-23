import React, { Component } from 'react';

import { Range as range } from 'immutable';

export default class MonthSelector extends Component {

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

  getMonthDisplay (month) {
    if (this.props.monthType == 'numeric') {
      return month;
    } else {
      throw new Error('monthType not recognized');
    }
  }

  render () {
    const {monthType, meta, input, ...props} = this.props;
    return (
      <select {...props} {...input} onChange={this.onChange.bind(this)} value={this.state.value}>
        <option value="">Month</option>
        {range(1, 13).map(month => <option key={month} value={month}>{this.getMonthDisplay(month)}</option>)}
      </select>
    );
  }
}
