import SELLER from 'action-types/seller';
import { handleActions } from 'redux-actions';
const storage = localStorage;
const initState = {
  currentStep: 1,
  currentInfoStep: 1,
  paymentStep: 1,
  company: '',
  prefix: '',
  userInfo: {},
  companyInfo: {},
  account: {}
};

function storeInfo (state = initState, { payload, payload: { step, infoStep } }) {
  if (step === 1){
    return {...state, company: payload.companyName, prefix: payload.slug };
  } else if (step === 2) {
    if (infoStep === 1) {
      const { userInfo } = payload;
      return {...state, userInfo };
    } else if (infoStep === 2) {
      const { account } = payload;
      return {...state, account };
    }
  } else if (step === 4 || step === 3 || step === 5){
    const { account, accountPending, productListed } = payload;
    if (account) {
      return {...state, account, accountPending, productListed};
    }
  }

  return state;
}

function companyInfo (state = initState, action) {
  if (action.payload.currentInfoStep === 2){
    return {...state, currentStep: action.payload.currentStep, currentInfoStep: action.payload.currentInfoStep, company: action.payload.data.companyName, userInfo: action.payload.data.userInfo};
  }
  return state;
}

function stripeInfo (state = initState, { payload }) {
  let accountkey = '';
  for (let key of Object.keys(payload.currentAccountKey)) {
    accountkey = key;
    storage.setItem('current_account_key', accountkey);
  }
  storage.setItem('current_account_uid', payload.currentAccountUid);
  if (payload.currentStep > 2){
    return {...state, currentStep: payload.currentStep, company: accountkey, paymentStep: payload.paymentStep };
  }
  return state;
}

function sellerStripeInfo (state = initState, { payload }) {
  return {...state, account: payload.account};
}

function changeStep (state = initState, { payload }) {
  return {...state, currentStep: payload };
}

function changeInfoStep (state = initState, { payload }) {
  return {...state, currentInfoStep: payload };
}

function changePaymentStep (state = initState, { payload }) {
  return {...state, paymentStep: payload };
}

function productPopup (state = initState, { payload }) {
  return {...state, productPopup: payload, productListed: payload.productListed, accountPending: payload.accountPending};
}

function productListed (state = initState, { payload }) {
  return {...state, productListed: payload.productListed, accountPending: payload.accountPending};
}


export default handleActions({
  //[SELLER.STORE_SELLER_NEXT_INFO]: nextInfo,
  [SELLER.PRODUCT_POPUP]: productPopup,
  [SELLER.PRODUCT_LISTED]: productListed,
  [SELLER.STORE_INFO]: storeInfo,
  [SELLER.STORE_SELLER_INFO_NEXT_STEP]: companyInfo,
  [SELLER.STORE_SELLER_STRIPE_INFO]: stripeInfo,
  [SELLER.SELLER_CURRENT_ACCOUNT]: sellerStripeInfo,
  [SELLER.CHANGE_STEP]: changeStep,
  [SELLER.CHANGE_INFO_STEP]: changeInfoStep,
  [SELLER.CHANGE_PAYMENT_STEP]: changePaymentStep
}, initState);
