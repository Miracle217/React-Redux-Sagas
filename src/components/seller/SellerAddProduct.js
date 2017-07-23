'use strict';
import React, { Component, PropTypes } from 'react';
import SELLER from 'action-types/seller';
import { connect } from 'react-redux';
import InputImage from '../common/inputImage';
import NotificationList from 'components/common/NotificationList';
import buildAction from 'helpers/buildAction';
import Loading from 'components/common/Loading';


const IMAGE_SIZE_LIMIT = 5 * 1024 * 1024 - 140; // acceptable size for twilio

export class SellerAddProduct extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.state = { title: '', description: '', price: '', quantity: '', shippingCharge: '', imageUrl: '', image: null};
    this.onChange = this.onChange.bind(this);
    this.changeImage = this.changeImage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.productPopup = this.productPopup.bind(this);
  }

  changeImage (imgURL, file) {
    this.setState({
      imageUrl: imgURL,
      image:  file
    });
  }

  onSubmit () {
    const {dispatch} = this.props;
    dispatch({ type: SELLER.SUBMITTED_FORM, product: this.state });
  }

  onChange (e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  productPopup () {
    this.props.dispatch(buildAction(SELLER.PRODUCT_POPUP, false));
  }

  render () {
    var key = this.props.key;
    return (
      <div className="modal-container" key={key}>
    <div className="modal">
      <h6>add product</h6>
      <NotificationList notifications={this.props.notifications} />
      <Loading />
      <form action="">
        <div className="row account">
          <div className="small-12 columns">
            <label htmlFor="" className="form-label">add product image</label>
            <br/>
            <InputImage className="btn btn-primary" sizeLimit={IMAGE_SIZE_LIMIT} accept="image/*" changeImage={this.changeImage}>
              <div className="upload-image-container small show-for-medium-up" />
            </InputImage>
          </div>
        </div>
        <div className="row">
          <div className="small-12 columns">
            <label htmlFor="" className="form-label">product name</label>
            <input
              type="text"
              placeholder=""
              onChange={this.onChange}
              className="field"
              name="title"
              autoFocus required
              value={this.state.title} />
          </div>
          <div className="small-12 columns">
            <label htmlFor="" className="form-label">product description</label>
            <textarea
              id=""
              className="field"
              cols="30"
              onChange={this.onChange}
              name="description"
              rows="4"
              value={this.state.description} />
          </div>
        </div>
        <div className="row">
          <div className="small-12 medium-4 columns">
            <label htmlFor="" className="form-label">price</label>
            <span className="currency" />
            <input
              type="number"
              placeholder="0.00"
              className="field currency" required
              onChange={this.onChange}
              name="price"
              value={this.state.price}
              />
          </div>
          <div className="small-12 medium-4 columns">
            <label htmlFor="" className="form-label">shipping charge</label>
            <span className="currency" />
            <input
               type="number"
               placeholder="0.00"
               className="field currency"
               onChange={this.onChange}
              name="shippingCharge"
              value={this.state.shippingCharge}/>
          </div>
          <div className="small-12 medium-4 columns">
            <label htmlFor="" className="form-label">max quantity (optional)</label>
            <input
               type="number"
               placeholder="unlimited"
               pattern="[0-9]*"
               className="field"
               onChange={this.onChange}
              name="quantity"
              value={this.state.quantity}
               />
          </div>
        </div>
        <div className="text-center">
          <input type="button" value="add product" onClick={this.onSubmit} className="form-button" /><br />
          <a href="javascript:void(0)" onClick={this.productPopup}>cancel</a>
        </div>
      </form>
    </div>
  </div>
    );
  }
}
export default connect(state => ({
  notification: state.ui.notifications,
  product: state.sellerProduct.product,
  showProductPopUp: state.sellerProduct.showProductPopUp
}))(SellerAddProduct);
