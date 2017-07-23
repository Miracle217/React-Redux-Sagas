const maybe = (obj, ...args) => (obj && typeof obj === 'object' && args.length) ? (args[0] in obj ? maybe.apply(null, [obj[args[0]]].concat(args.slice(1))) : null) : obj;

export default maybe;
