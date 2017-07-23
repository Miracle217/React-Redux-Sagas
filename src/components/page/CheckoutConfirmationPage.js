import React from 'react';
import { connect } from 'react-redux';
import CreateAccount from 'components/signup/CreateAccount';
import PhoneNumberEntry from 'components/signup/PhoneNumberEntry';
import ConfirmationCodeEntry from 'components/signup/ConfirmationCodeEntry';
import SocialMediaEntry from 'components/signup/SocialMediaEntry';
import MailingAddressEntry from 'components/signup/MailingAddressEntry';
import PaymentEntry from 'components/signup/PaymentEntry';
import WelcomeBody from 'components/common/WelcomeBody';
import NotificationList from 'components/common/NotificationList';
import Loading from 'components/common/Loading';

export const stageMapping = {
  createAccount: CreateAccount,
  phoneNumber: PhoneNumberEntry,
  confirmationCode: ConfirmationCodeEntry,
  //socialMedia: SocialMediaEntry, // not used
  mailingAddress: MailingAddressEntry,
  payment: PaymentEntry,
  welcome: WelcomeBody
};


const CheckoutPage = ({user, notifications, transaction}) => {
  if (!transaction) {
    return null;
  }
  const { charges, product, account } = transaction;

  const taxesShipping = product && product.type !== 'Donation' ? (
    <div>
      <div className="price-supplemental">
        <div className="row">
          <span className="price-label">Subtotal</span>
          <span className="price pull-right">{formatPrice(charges.price)}</span>
        </div>
        <div className="row">
          <span className="price-label">Taxes</span>
          <span className="price pull-right">{formatPrice(charges.tax)}</span>
        </div>
        <div className="row">
          <span className="price-label">Shipping</span>
          <span className="price pull-right">{formatPrice(charges.shipping)}</span>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="receipt">
      <NotificationList notifications={notifications} />
      <Loading />
      {/* old banner, not used */}
      {/*<div className="banner">buy with a hashtag and get $5 off <i className="pull-right fa fa-caret-right"></i></div>*/}
      <h1 className="dark">{product && product.type === 'Donation' ? 'donation confirmation' : 'order confirmation'}</h1>
      <div className="receipt-header">
        <img src={product && product.type === 'Donation' ? account.logoUrl : product.imageUrl} className="product-photo-small"/>
        <h3 className="product-caption-title">{account.name}</h3>
        <p>{product && product.type === 'Donation' ? 'Thank you for your Donation. A Receipt has been sent to you via e-mail.' : null}</p>
      </div>
      <div className="price-container">
        {taxesShipping}
        <hr />
        <div className="row">
          <span className="price-label">{product && product.type === 'Donation' ? 'Donation Total' : 'Total'}</span>
          <span className="pull-right">{formatPrice(charges.price + charges.tax + charges.shipping)}</span>
        </div>
      </div>

    </div>
  );
};

function formatPrice (value) {
  return `\$${(value / 100).toFixed(2)}`;
}

export default connect(state => ({
  user: state.user,
  notifications: state.ui.notifications,
  transaction: state.checkout.checkoutParams.transaction
}))(CheckoutPage);
