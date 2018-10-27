const { ecs } = require('../aws');

const serviceCommands = (vorpal, store, enterResource) => [
  vorpal.command('desc', 'describe service').action(async function() {
    const res = await ecs
      .describeServices({
        cluster: store.currentResourceNode.parent.arn,
        services: [store.currentResourceNode.arn]
      })
      .promise();
    this.log(res);
  })
];

module.exports = serviceCommands;
