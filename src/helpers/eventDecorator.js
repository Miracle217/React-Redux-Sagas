export default (fn, skipPreventDefault, skipStopPropagation) => event => {
  if (!skipPreventDefault) {
    event.preventDefault();
  }
  if (!skipStopPropagation) {
    event.stopPropagation();
  }
  return fn(event);
};
