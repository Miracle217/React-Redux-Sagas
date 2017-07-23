import React from 'react';
import {connect} from 'react-redux';
import Loading from 'components/common/Loading';
import DashboardSocialAccounts from 'components/dashboard/DashboardSocialAccounts';
import DashboardPhoneNumberEdit from 'components/dashboard/DashboardPhoneNumberEdit';
import DashboardEmailEdit from 'components/dashboard/DashboardEmailEdit';
import DashboardAddressEdit from 'components/dashboard/DashboardAddressEdit';
import DashboardPaymentEdit from 'components/dashboard/DashboardPaymentEdit';
import DashboardChecklist from 'components/dashboard/DashboardChecklist';


export const DashboardBody = ({checked, user, notifications}) => {
  if (!checked || !user) {
    return null;
  }
  return (
    <div className="row">
      <DashboardChecklist user={user} />
      <DashboardSocialAccounts user={user} />
      <DashboardPhoneNumberEdit  user={user}  />
      <DashboardAddressEdit  user={user} />
      <DashboardEmailEdit  user={user} />
      <DashboardPaymentEdit  user={user} />
    </div>
  );
};

export default connect(state => ({checked: state.user.checked, user: state.user.data, notifications: state.ui.notifications}))(DashboardBody);
