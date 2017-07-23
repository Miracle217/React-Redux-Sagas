import React from 'react';
import DashboardBody from 'components/dashboard/DashboardBody';
import DashboardWrapper from 'components/common/DashboardWrapper';

const DashboardPage = ({user}) => (
  <DashboardWrapper subtitle="Connect social accounts and update your account info." selected="account">
    <DashboardBody />
  </DashboardWrapper>
);

export default DashboardPage;
