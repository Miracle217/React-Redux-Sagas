import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import USER from 'action-types/user';
import buildAction from 'helpers/buildAction';
import { receipt as receiptRoute } from 'app/routes';
import objectPairs from 'helpers/objectPairs';
import dateDiff from 'helpers/dateDiff';
import formatPrice from 'helpers/formatPrice';
import Loading from 'components/common/Loading';
import NotificationList from 'components/common/NotificationList';

const HistoryBody = ({receipts, notifications}) => {
  return (
    <section className="">
      <Loading />
      <NotificationList notifications={notifications} />
      <div className="row">
        <div className="small-12 small-centered columns">
          <div className="header no-padding">
            <h1>items you bought</h1>
          </div>
          <ul className="listed-items no-bullet">
            {objectPairs(receipts).map(({key, value}) => (value && value.charges) && (
              <li key={key}>
                <Link to={`${receiptRoute}?receipt=${key}`} className="history-item">
                  <div className="row">
                    <span className="medium-3 hide-for-small-only columns">{value.account.name}</span>
                    <span className="medium-3 small-4 columns">{value.product.title}</span>
                    <span className="medium-3 small-5 columns">{dateDiff(new Date(value.created)) + ' ago'}</span>
                    <span className="medium-3 small-3 columns text-right">{formatPrice((+value.charges.price + value.charges.tax + value.charges.shipping) / 100)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default connect(state => ({
  notifications: state.ui.notifications,
  receipts: state.user.receipts || {}
}))(HistoryBody);
