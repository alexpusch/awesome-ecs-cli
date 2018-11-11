const { Command, flags } = require('@oclif/command');
const fs = require('fs-extra');
const path = require('path');
const { ecs } = require('../lib/aws');
const describeCluster = require('../lib/describeCluster');
const describeService = require('../lib/describeService');
const readMetadataJson = require('../lib/readMetadataJson');
const ora = require('ora');

class DescribeCommand extends Command {
  async run() {
    const currentMetadata = await readMetadataJson('.');

    let output;
    let spinner;

    try {
      if (currentMetadata.type === 'cluster') {
        spinner = ora('Fetching cluster description').start();
        output = await describeCluster(currentMetadata.clusterArn);
        spinner.stop();
      } else if (currentMetadata.type === 'service') {
        spinner = ora('Fetching service description').start();
        output = await describeService(
          currentMetadata.clusterArn,
          currentMetadata.serviceArn
        );
        spinner.stop();
      }

      this.log(output);
    } catch (e) {
      spinner.fail();
      this.error(e.message);
    }
  }
}

DescribeCommand.description = 'Describe current resource';

module.exports = DescribeCommand;
