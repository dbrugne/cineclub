const debug = (process.env.DEVMODE !== '1')
  ? Function
  : (...args) => console.log.apply(console, args);

module.exports = debug;
