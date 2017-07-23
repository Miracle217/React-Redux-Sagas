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

const SignupPage = ({user, notifications, step}) => {
  return (
    <ul className="no-bullet form-switcher">
      {Object.keys(stageMapping).map(key => {
        let FormClass = stageMapping[key];
        return (
          <li key={key} className={key == step ? `${key}` : `${key} hidden`}>
            <div className="form-container">
              <NotificationList notifications={notifications} />
              <Loading />
              <FormClass
                className={key}
                user={user}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default connect(state => ({
  user: state.user,
  notifications: state.ui.notifications,
  step: state.ui.route.params.step
}))(SignupPage);
