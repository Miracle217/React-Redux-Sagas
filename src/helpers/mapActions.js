export default  (actions, actionPrefix) =>
  actions.reduce((mapping, action) => ({...mapping, [action]: `${actionPrefix}/${action}`}), {});
