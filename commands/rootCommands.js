const topState = (vorpal, store, enterResource) => [
  vorpal.command('list', 'list clusters').action(function() {
    this.log(store.currentResourceNode.children.map(r => r.title));
    return Promise.resolve();
  }),

  vorpal
    .command('cd <name>', 'enter cluster')
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
        this.log(`cd: no such cluster: ${name}`);
        return;
      }

      await enterResource(childResourceNode);
    })
];

module.exports = topState;
