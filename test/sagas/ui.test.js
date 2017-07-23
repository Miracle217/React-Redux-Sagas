import '../common';
import { expect } from 'chai';
import sinon from 'sinon';
import { put, call } from 'redux-saga/effects';
import { routeMounted } from 'sagas/ui.js';

global. ga = sinon.spy();

describe('Route Mounted SAGA', () => {
  it('Should dispatch the Route Mounted saga', () => {
    const mockAction = {payload:{}};
    const generator = routeMounted(mockAction);
    expect( generator.next().value ).to.deep.equal( put({type: 'UI/SET_ROUTE', payload: {} }));
    expect( ga.called ).to.be.true;
  });
});

