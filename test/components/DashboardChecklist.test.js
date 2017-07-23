import '../common';

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { DashboardChecklist } from 'components/dashboard/DashboardChecklist';

describe('<DashboardChecklist />', (user) => {
  it('renders one ul component', () => {
    const wrapper = shallow(<DashboardChecklist />);
    expect(wrapper.find(ul)).to.have.length(1);
  });

  it('renders a `.checklist`', () => {
    const wrapper = shallow(<DashboardChecklist />);
    expect(wrapper.find('.checklist')).to.have.length(1);
  });

  it('should have props for email and src', function () {
    const wrapper = shallow(<DashboardChecklist />);
    expect(wrapper.props().complete).to.be.defined;
    expect(wrapper.props().hide).to.be.defined;
  });
});
