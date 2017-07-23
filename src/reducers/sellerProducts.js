import SELLER from 'action-types/seller';
import { handleActions } from 'redux-actions';

const initState = {
  product: {},
  productListed: false,
  showProductPopUp: false
};

function productCreated (state = initState, action) {
  switch (action.type) {
    case 'SELLER/PRODUCT_CREATED':
      return {...state, product: action.payload.productHash, productListed: true, showProductPopUp: false};
  }
  return state;
}

export default handleActions({
  [SELLER.PRODUCT_CREATED]: productCreated
}, {});
