export const setMultiple = (obj) => Object.keys(obj).forEach(key => localStorage.set(key, obj[key]));
export const setObject = (key, obj) => localStorage.setItem(key, JSON.stringify(obj));
export const getObject = (key) => JSON.parse(localStorage.getItem(key));
export const clearObject = () => localStorage.clear();

export default localStorage;
