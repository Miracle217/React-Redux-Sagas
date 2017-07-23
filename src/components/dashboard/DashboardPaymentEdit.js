'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DASHBOARD from 'action-types/dashboard';
import buildAction from 'helpers/buildAction';
import Loading from 'components/common/Loading';
import NotificationList from 'components/common/NotificationList';

import CreditCardNumber from 'components/common/CreditCardNumber';
import MonthSelector from 'components/common/MonthSelector';
import YearSelector from 'components/common/YearSelector';

const DashboardPaymentEdit = ({user, cards, dashboard, defaultCard, ui, dispatchAddCardModal, dispatchEditCardModal, dispatchSubmitPayment, dispatchRemovePayment, dispatchUpdatePayment}) => {
  if (!user) {
    return null;
  }
  const editCardForm = {}, addCardForm = {};
  const startYear = new Date().getFullYear();
  const endYear = startYear + 31;
  let currentCard = dashboard.currentCardId ? cards.filter(card => card.id == dashboard.currentCardId)[0] : {};

  const onAddCard = e => {
    e.preventDefault();
    dispatchAddCardModal();
  };
  const onRemoveCard = (card, e) => {
    e.preventDefault();
    /* eslint-disable no-alert */
    var confirmDelete = confirm('Are you sure you want to remove this credit card?');
    /* eslint-enable no-alert */
    if (confirmDelete) {
      dispatchRemovePayment(card);
    }
  };

  const onEditCard = (card, e) => {
    e.preventDefault();
    dispatchEditCardModal(card);
  };

  const onAddSubmit = (e) => {
    e.preventDefault();
    const card = {
      number: addCardForm.number.value,
      cvc: addCardForm.ccv.value,
      exp_month: addCardForm.exp_month.value,
      exp_year: addCardForm.exp_year.value,
      address_zip: addCardForm.address_zip.value
    };
    dispatchSubmitPayment(card);
  };

  const onEditSubmit = (e) => {
    e.preventDefault();
    const card = {
      cardId: dashboard.currentCardId,
      exp_month: editCardForm.exp_month.value,
      exp_year: editCardForm.exp_year.value,
      address_zip: editCardForm.address_zip.value
    };
    dispatchUpdatePayment(card);
  };

  const addCardHtml = cards.length < 1 ? (
      <a onClick={onAddCard}>Add Card</a>
    ) : (
      null
    );

  const cardsHtml = cards.map(card => (
    <div key={card.id} className="row collapse">
      <div className="small-6 columns">
        {`**** ${card.last4}`} <br />
        <span className="caption">{card.exp_month} / {card.exp_year}</span>
      </div>
      <div className="small-3 columns text-center">
        <a onClick={onEditCard.bind(null, card)}>Update</a>
      </div>
      <div className="small-3 columns text-center">
        <a onClick={onRemoveCard.bind(null, card)}>Remove</a>
      </div>
    </div>
  ));

  const addCardModal = dashboard.addCardModal ? (
    <div>
      <a className="close-button" onClick={dispatchAddCardModal}>&times;</a>
      <h3>Add card info</h3>
      <form onSubmit={onAddSubmit}  className="text-center">
        <CreditCardNumber ref={r => addCardForm.number = r} type="tel" name="cardNumber" placeholder="Card Number" inputMode="numeric" id="cc-number" />
        <input ref={r => addCardForm.ccv = r} type="number" placeholder="Security Code" title="Security Code" pattern="[0-9]*" inputMode="numeric" required id="cc-ccv" />
        <MonthSelector ref={r => addCardForm.exp_month = r} monthType="numeric" required />
        <YearSelector ref={r => addCardForm.exp_year = r} startYear={startYear} endYear={endYear} required />
        <input ref={r => addCardForm.address_zip = r} type="number" pattern="[0-9]*" inputMode="numeric" placeholder="Zip Code" required id="postalCode" />
        <input className="form-button" type="submit" value="Submit" />
      </form>
    </div>
  ) : null;

  const editCardModal = dashboard.editCardModal ? (
    <div className="">
      <a className="close-button" onClick={dispatchEditCardModal}>&times;</a>
      <h3>Update card info</h3>
      <form onSubmit={onEditSubmit} className="text-center">
        <input disabled value={`**** **** **** ${currentCard.last4}`} />
        <MonthSelector ref={r => editCardForm.exp_month = r} value={currentCard.exp_month} monthType="numeric" required />
        <YearSelector ref={r => editCardForm.exp_year = r}  value={currentCard.exp_year} startYear={startYear} endYear={endYear} required />
        <input  ref={r => editCardForm.address_zip = r}  value={currentCard.address_zip} type="number" pattern="[0-9]*" inputMode="numeric" placeholder="Zip Code" required />
        <input className="form-button" type="submit" value="Submit" />
      </form>
    </div>
  ) : null;

  const paymentBody = (dashboard.addCardModal || dashboard.editCardModal) ? null : (
    <div>
      <a name="payment">
        <h3>Payment Info</h3>
      </a>
        {cardsHtml}
      <div className="form-subheader">
        {addCardHtml}
      </div>
    </div>
  );

  return (
    <div className="setting-block">
      <Loading />
      <NotificationList filter="payment" />
      <div className="setting-block-inner">
        {paymentBody}
        {addCardModal}
        {editCardModal}
      </div>
    </div>
  );
};

export default connect(state => ({
  defaultCard: state.user.defaultCard,
  dashboard: state.dashboard || {},
  cards: state.user.cards || [],
  ui: state.ui
}), dispatch => ({
  dispatchAddCardModal: () => dispatch(buildAction(DASHBOARD.ADD_CARD_MODAL)),
  dispatchEditCardModal: card => dispatch(buildAction(DASHBOARD.EDIT_CARD_MODAL, card.id)),
  dispatchRemovePayment: card => dispatch(buildAction(DASHBOARD.REMOVE_PAYMENT, card.id)),
  dispatchSubmitPayment: card => dispatch(buildAction(DASHBOARD.SUBMIT_PAYMENT, card)),
  dispatchUpdatePayment: card => dispatch(buildAction(DASHBOARD.UPDATE_PAYMENT, card))
}))(DashboardPaymentEdit);
