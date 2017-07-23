'use strict';

import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import RouteDispatcher from 'components/RouteDispatcher';
import sellerInfo from './seller/SellerAddInfo';
import sellerPaymentInfo from './seller/SellerPaymentMethod';
import * as routes from 'app/routes';
import Layout from './Layout.js';
import {
  AboutPage,
  LandingPage,
  PrivacyPage,
  ContactPage,
  LoadingPage,
  DashboardPage,
  SignupPage,
  HistoryPage,
  ReceiptPage,
  TwitterOptOutPage,
  CheckoutPage,
  CheckoutConfirmationPage,
  SellerOnboarding
} from './page';
import EmailLogin from './common/EmailLogin';
import Blank from './page/blank';

export default function ({store, history}) {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route component={RouteDispatcher}>
          <Route component={Layout}>
            <Route path={routes.root} component={LandingPage}/>
            <Route path={routes.about} component={AboutPage} />
            <Route path={routes.contact} component={ContactPage} />
            <Route path={routes.privacy} component={PrivacyPage} />
            <Route path={routes.signup} component={SignupPage} />
            <Route path={routes.authCallBack} component={Blank} />
            <Route path={routes.signupStep} component={SignupPage} />
            <Route path={routes.dashboard} component={DashboardPage} />
            <Route path={routes.buying} component={HistoryPage} />{/* TODO: Deprecate buying into history */}
            <Route path={routes.history} component={HistoryPage} />
            <Route path={routes.checkout} component={CheckoutPage} />
            <Route path={routes.sellerOnboarding} component={SellerOnboarding} />
            <Route path={routes.checkoutConfirmation} component={CheckoutConfirmationPage} />
            <Route path={routes.receipt} component={ReceiptPage} />
            <Route path={routes.instagramAuthCallback} component={LoadingPage} />
            <Route path={routes.twitterAuthCallback} component={LoadingPage} />
            <Route path={routes.stripeCallback} component={LoadingPage} />
            <Route path={routes.twitterOptout} component={TwitterOptOutPage} />
            <Route path={routes.verifyEmail} component={LoadingPage} />
            <Route path={routes.emailLogin} component={EmailLogin} />
            <Route path="*" component={LoadingPage}/>
          </Route>
        </Route>
      </Router>
    </Provider>
  );
}
