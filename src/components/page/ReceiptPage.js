import React from 'react';
import { connect } from 'react-redux';
import formatPrice from 'helpers/formatPrice';
import Loading from 'components/common/Loading';
import NotificationList from 'components/common/NotificationList';
import formatPhoneNumber from 'helpers/formatPhoneNumber';

export const ReceiptPage = ({receipt, notifications, receiptsChecked}) => (receipt && receipt.charges) ? (
  <main>
    <Loading />
    <NotificationList notifications={notifications} />
    <div className="boost-app-form small-inputs">
      <div className="row">
        <div className="large-12 columns no-padding">
          <dl className="receipt-body centered">
            <dd className="product-title">{receipt.account.name}</dd>
            <dd className="small-text">YOUR TOTAL</dd>
            <dd className="purchase-price">{formatPrice((receipt.charges.price + receipt.charges.tax + receipt.charges.shipping) / 100)}</dd>
            <dd className="item-description">{receipt.product.description}<span className="float-right">{formatPrice(receipt.charges.price / 100)}</span></dd>
            <dd className="item-description extra">{receipt.product.hashtag}</dd>
            <dd className="item-description">Subtotal<span className="float-right">{formatPrice(receipt.charges.price / 100)}</span></dd>
            <dd className="item-description extra">Tax<span className="float-right">{formatPrice(receipt.charges.tax / 100)}</span></dd>
            <dd className="item-description extra">Shipping<span className="float-right">{formatPrice(receipt.charges.shipping / 100)}</span></dd>
            <dd className="item-description total">Total<span className="float-right">{formatPrice((+receipt.charges.price + receipt.charges.shipping + receipt.charges.tax) / 100)}</span></dd>
            <span className="line" />
            <dd className="small-text">HAVE A QUESTION?</dd>
            <dd className="item-description contact"><a href={`mailto:${receipt.account.email}`}>{receipt.account.email}</a></dd>
            <dd className="item-description contact"><a href={`tel:${receipt.account.phone}`}>{formatPhoneNumber(receipt.account.phone)}</a></dd>
          </dl>
        </div>
      </div>
    </div>
  </main>
) : receiptsChecked ? (
  <article>
    <Loading />
    <NotificationList notifications={notifications} />
    <div className="row product-head">
      <h4>Receipt could not be found</h4>
    </div>
  </article>
) : (
  <article>
    <Loading />
    <NotificationList notifications={notifications} />
    <div className="row product-head">
      <h4>Loading Receipts ...</h4>
    </div>
  </article>
);

export default connect(state => ({
  notifications: state.ui.notifications,
  receipt: state.user.currentReceipt,
  receiptsChecked: state.user.receiptsChecked
}))(ReceiptPage);
