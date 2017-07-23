export default (fn) => {
  try {
    return fn();
  } catch (err) {
    return null;
  }
};
