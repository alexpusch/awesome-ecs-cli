const createEnterResourceFn = (vorpal, store) => resourceNode => {
  store.currentStateCommands.forEach(c => c.remove());
  store.currentResourceNode = resourceNode;
  store.currentStateCommands = require(`./commands/${
    resourceNode.type
  }Commands`)(vorpal, store, createEnterResourceFn(vorpal, store));

  vorpal.delimiter(`${getResourcePath(store.currentResourceNode)} >`).show();
};

const getResourcePath = resourceNode => {
  if (!resourceNode.parent) {
    return resourceNode.title;
  }

  return `${getResourcePath(resourceNode.parent)}/${resourceNode.title}`;
};

module.exports = createEnterResourceFn;
