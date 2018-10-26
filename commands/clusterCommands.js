const clusterCommands = (vorpal, store, enterResource) => [
  vorpal.command('list', 'list services').action(function() {
    this.log(store.currentResourceNode.children.map(r => r.title));
    return Promise.resolve();
  }),

  vorpal
    .command('cd <name>', 'enter services')
    .autocomplete({
      data: function() {
        return store.currentResourceNode.children.map(c => c.title);
      }
    })
    .action(async function(args) {
      const { name } = args;

      const childResourceNode = store.currentResourceNode.children.find(
        r => r.title === name
      );

      if (!childResourceNode) {
        this.log(`cd: no such services: ${name}`);
        return;
      }

      await enterResource(childResourceNode);
    })
];

module.exports = clusterCommands;
