import '../common';

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { DashboardAddressEdit, form } from 'components/dashboard/DashboardAddressEdit';



describe('<DashboardAddressEdit />', () => {
  it('renders one form component', () => {
    const wrapper = shallow(<DashboardAddressEdit />);
    expect(wrapper.find(form)).to.have.length(1);
  });

  it('renders an `.setting-block full`', () => {
    const wrapper = shallow(<DashboardAddressEdit />);
    expect(wrapper.find('.setting-block full')).to.have.length(1);
  });

  it('renders children when passed in', () => {
    const wrapper = shallow(
        <DashboardAddressEdit>
          <div className="setting-block full" />
        </DashboardAddressEdit>
    );
    expect(wrapper.contains(<div className="setting-block full" />)).to.equal(true);
  });
});
