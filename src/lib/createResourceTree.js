const fs = require('fs-extra');
const path = require('path');
const { ecs } = require('./aws');
const createMetadataJson = require('./createMetadataJson');

const createResourceTree = async () => {
  const res = await ecs.listClusters().promise();

  await createMetadataJson('.', { profile: process.env.AWS_PROFILE });
  await Promise.all(res.clusterArns.map(createClusterResourceTree));
};

const createClusterResourceTree = async clusterArn => {
  const clusterDirPath = getNameFromArn(clusterArn);
  await fs.mkdir(clusterDirPath);
  await createMetadataJson(clusterDirPath, {
    type: 'cluster',
    clusterArn
  });

  const res = await ecs.listServices({ cluster: clusterArn }).promise();

  await Promise.all(
    res.serviceArns.map(createServiceResourceTree.bind(null, clusterArn))
  );
};

const createServiceResourceTree = async (clusterArn, serviceArn) => {
  const servicePath = path.join(
    getNameFromArn(clusterArn),
    getNameFromArn(serviceArn)
  );
  await fs.mkdir(servicePath);
  await createMetadataJson(servicePath, {
    type: 'service',
    clusterArn,
    serviceArn
  });
};

const getNameFromArn = arn => arn.split('/')[1];

module.exports = createResourceTree;
