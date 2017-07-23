import phoneformat from 'phoneformat.js';
export default number => phoneformat.formatLocal(phoneformat.countryForE164Number(number), number);
