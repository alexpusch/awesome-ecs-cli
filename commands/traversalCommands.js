const traversalCommands = (vorpal, store, enterResource) => [
  vorpal.command('ls', 'list child resources').action(function() {
    this.log(store.currentResourceNode.children.map(r => r.title));
    return Promise.resolve();
  }),

  vorpal
    .command('cd <name>', 'enter child resource')
    .autocomplete({
      data: function() {
        return ['..', ...store.currentResourceNode.children.map(c => c.title)];
      }
    })
    .action(async function(args) {
      const { name } = args;

      const childResourceNode =
        name === '..'
          ? store.currentResourceNode.parent
          : store.currentResourceNode.children.find(r => r.title === name);

      if (!childResourceNode) {
        this.log(`cd: no such child resource: ${name}`);
        return;
      }

      await enterResource(childResourceNode);
    })
];

module.exports = traversalCommands;
