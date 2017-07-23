import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import SELLER from 'action-types/seller';
import { buildAction, createRequest, storageGetObject, storageSetObject } from 'helpers';
import UI from 'action-types/ui';

const IMAGE_SIZE_LIMIT = 5 * 1024 * 1024 - 140; // acceptable size for twilio

function * submitProductForm (getState, action) {
  const sellerData = storageGetObject('sellerOnboarding');
  const accountId  = sellerData.accountId;
  //toDO remove account key from local storage
  const { product } = action;
  yield put(buildAction(UI.LOAD_START));
  yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
  yield saveProduct(getState, {payload: {product: product, accountId: accountId }});
}

function * saveProduct(getState, action) {
  const { product, accountId } = action.payload;
  if (product.image) {
    if (product.image.size > IMAGE_SIZE_LIMIT) {
      yield put(buildAction(UI.ADD_NOTIFICATION, {message: 'Image must be under 5MB'}));
      yield put(buildAction(UI.LOAD_END));
      return;
    }

    const fd = new FormData();

    const cloudName = 'dgwzk3bjd';
    const uploadPreset = 'product-images';

    fd.append('upload_preset', uploadPreset);
    fd.append('file', product.image);

    const response = yield fetch('https://api.cloudinary.com/v1_1/' + cloudName + '/image/upload', {
      body: fd,
      method: 'POST'
    });

    const data = yield response.json();

    if (data.error) {
      yield put(buildAction(UI.ADD_NOTIFICATION, {message: data.error, level: 'alert'}));
      yield put(buildAction(UI.LOAD_END));
      return;
    }

    product.disableImage = false;
    product.imageUrl = data.url;
    product.image = null;
  } else if (product.disableImage) {
    product.imageUrl = false;
  }
  try {
    //toDO remove account key from local storage
    //excluding imageUrl ...
    const productHash = Object.assign({}, product);
    delete productHash.image;
    yield createRequest('saveProduct', { accountId: accountId, product: productHash, key:null });
    yield put(buildAction(SELLER.PRODUCT_CREATED, {productHash}));
    yield put(buildAction(SELLER.STORE_INFO, { product, step: 5, productListed: true, accountPending: false}));
    storageSetObject('sellerOnboarding', { accountId, step: 5, productListed: true, accountPending: false });
    yield put(buildAction(SELLER.CHANGE_STEP, 5));
    yield put(buildAction(SELLER.PRODUCT_POPUP, false));
    yield put(buildAction(SELLER.PRODUCT_LISTED, {productListed: true, accountPending: false}));
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: `Product "${productHash.title}" successfully saved`, level: 'success'}));
    yield put(buildAction(UI.LOAD_END));
  } catch (err) {
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: err.message || err, level: 'alert'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export default function * (getState) {
  yield [
    takeEvery(SELLER.SUBMITTED_FORM, submitProductForm, getState)
  ];
}
