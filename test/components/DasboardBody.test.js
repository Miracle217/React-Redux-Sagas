import '../common';

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { DashboardBody, DashboardChecklist, DashboardSocialAccounts } from 'components/dashboard/DashboardBody';

describe('<DashboardBody />', () => {
  it('renders one <DashboardChecklist />component', () => {
    const wrapper = shallow(<DashboardBody />);
    expect(wrapper.find(<DashboardChecklist />)).to.have.length(1);
  });

  it('renders an `.row`', () => {
    const wrapper = shallow(<DashboardBody />);
    expect(wrapper.find('.row')).to.have.length(1);
  });

  it('renders children when passed in', () => {
    const wrapper = shallow(
        <DashboardBody>
           <DashboardSocialAccounts />
        </DashboardBody>
    );
    expect(wrapper.contains( <DashboardSocialAccounts />)).to.equal(true);
  });
});
