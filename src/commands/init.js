const { Command, flags } = require('@oclif/command');
const createResourceTree = require('../lib/createResourceTree');
const ora = require('ora');

class InitCommand extends Command {
  async run() {
    const spinner = ora('Mirroring ECS resources to local file system').start();

    try {
      await createResourceTree();
      spinner.succeed();
    } catch (e) {
      spinner.fail();
      this.error(e.message);
    }
  }
}

InitCommand.description = `Mirror ECS state to current directory`;

module.exports = InitCommand;
