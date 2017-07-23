import React, { Component } from 'react';

// A simple managed input text
export default class InputText extends Component {
  state = {value: ''};

  get value () {
    return this.state.value;
  }

  set value (val) {
    return this.setState({value: val});
  }

  getInput () {
    return this.refs.input;
  }

  componentWillReceiveProps (nextProps) {
    return this.setState({value: nextProps.value});
  }

  componentWillMount () {
    this.setState({value: this.props.value || this.props.defaultValue});
  }

  onChange (e) {
    this.setState({value: this.refs.input.value});
  }

  render () {
    return <input ref="input" {...this.props} onChange={this.onChange.bind(this)} value={this.state.value || ''} />;
  }
}
