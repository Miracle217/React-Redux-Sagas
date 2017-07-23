'use strict';

import React, { PropTypes } from 'react';

import InputElement from 'react-input-mask';

export default class CreditCardInput extends React.Component {
  state = {mask: '9999 9999 9999 9999', value: ''};

  constructor (props) {
    super(props);
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  get value () {
    return this.refs.input.refs.input.value;
  }

  checkMaskChange (e) {
    const target = e.target;
    const value = target.value;
    const selectionStart = target.selectionStart;
    const mask = value.match(/^3[74]/) ? '9999 999999 99999' // AmEx
      : value.match(/^3(0[0-5]|[68])/) ? '9999 999999 9999' // Diners Club
      : '9999 9999 9999 9999';

    this.setState({mask, value});
  }

  onSelectChange (e) {
    const input = this.refs.input;
    if (e.target.activeElement == input.refs.input) {
      if (input.getSelection().start > input.getFilledLength()) {
        input.setCaretToEnd();
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value != this.props.value) {
      this.setState({value: nextProps.value});
    }
  }

  componentDidMount (){
    global.document.addEventListener('selectionchange', this.onSelectChange);
  }

  componentWillUnmount () {
    global.document.removeEventListener('selectionchange', this.onSelectChange);
  }

  render () {
    const { input, meta, ...props } = this.props;
    return (
      <InputElement ref="input" {...props} {...input} {...this.state} onChange={this.checkMaskChange.bind(this)} />
    );
  }
}
