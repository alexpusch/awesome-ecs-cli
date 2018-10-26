const serviceCommands = (vorpal, store, enterState) => [
  vorpal.command('desc', 'describe service').action(async function() {
    this.log('desc');
  })
];

module.exports = serviceCommands;
