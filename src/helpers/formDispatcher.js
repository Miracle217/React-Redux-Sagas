// https://github.com/yelouafi/redux-saga/issues/161#issuecomment-191312502
// for dispatching forms with sagas
// creates a onSubmit handler that dispatches the specified action
export default (actionType) => (values, dispatch) => new Promise((resolve, reject) => dispatch({ type: actionType, payload: { values, resolve, reject } }));
