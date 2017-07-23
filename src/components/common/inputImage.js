import React, { Component } from 'react';

export default class InputImage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {state: 'blank'};
    this.onChange = this.onChange.bind(this);
  }

  onChange (e) {
    const { sizeErrorMessage } = this.props;

    if (this.props.onChange) {
      this.props.onChange(e);
    }
    if (!this.refs.input.files || !this.refs.input.files.length) {
      return this.setState({state: 'blank'});
    }
    const file = this.refs.input.files[0];
    if (this.props.sizeLimit && this.props.sizeLimit < file.size) {
      return this.setState({state: 'error', error: sizeErrorMessage || 'Image size is too large'});
    }
    const reader  = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('error', (err) => {
      this.setState({state: 'error', error: err.message});
    });
    reader.addEventListener('load', () => {
      this.props.changeImage(reader.result, file);
      this.setState({state: 'image', imageUrl: reader.result});
    });
    this.setState({state: 'loading'});
  }

  render () {

    const { className, style, emptyText, loadingText, children, value, ...props } = this.props;
    const { state, error, imageUrl } = this.state;
    return (
      <label className={className} style={style}>
        {
          state == 'loading' ? (loadingText || 'Loading ...') :
          state == 'error' ? error :
          state == 'image' ? <img width="100%" src={imageUrl} /> :
          children || emptyText || 'Upload Image'
        }
        <input ref="input" type="file" style={{display: 'none'}} onChange={e => this.onChange(e)} />
      </label>
    );
  }
}
