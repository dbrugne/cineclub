const debug = (process.env.DEVMODE !== '1')
  ? () => {}
  : (...args) => console.log.apply(console, args);

module.exports = debug;
