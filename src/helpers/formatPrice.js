export default (value) => `\$${(Number(String(value).replace(/\s*\$/, '') || 0)).toFixed(2)}`;
