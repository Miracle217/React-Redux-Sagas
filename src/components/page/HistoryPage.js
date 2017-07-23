'use strict';

import React, { Component} from 'react';
import { Link } from 'react-router';
import dateDiff from 'helpers/dateDiff';

import DashboardWrapper from 'components/common/DashboardWrapper';
import HistoryBody from 'components/common/HistoryBody';

export default ({user}) => {
  return (
    <DashboardWrapper subtitle="List new items, connect social accounts and update your account info." selected="history">
      <HistoryBody />
    </DashboardWrapper>
  );
};
