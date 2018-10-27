const vorpal = require('vorpal')();
const createEnterResourceFn = require('./createEnterResourceFn');
const { ecs } = require('./aws');
const traversalCommands = require('./commands/traversalCommands');

const main = async () => {
  try {
    const store = await getInitialStore();
    const enterResource = createEnterResourceFn(vorpal, store);
    traversalCommands(vorpal, store, enterResource);
    enterResource(store.resourceNode);
  } catch (e) {
    console.error(e);
  }
};

const getInitialStore = async () => {
  const res = await ecs.listClusters().promise();

  const rootNode = {
    type: 'root',
    title: '/'
  };

  const clusterNodes = await Promise.all(
    res.clusterArns.map(async clusterArn => {
      const res = await ecs.listServices({ cluster: clusterArn }).promise();
      const clusterNode = {
        type: 'cluster',
        title: clusterArn.split('/')[1],
        arn: clusterArn,
        parent: rootNode
      };

      const servicesNode = res.serviceArns.map(serviceArn => ({
        type: 'service',
        title: serviceArn.split('/')[1],
        arn: serviceArn,
        parent: clusterNode
      }));

      clusterNode.children = servicesNode;
      return clusterNode;
    })
  );

  rootNode.children = clusterNodes;

  const store = {
    resourceNode: rootNode,
    currentStateCommands: []
  };

  return store;
};

main();
