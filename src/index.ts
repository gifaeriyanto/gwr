import { Command, flags } from '@oclif/command';
import { exec } from 'child_process';
import { existsSync, mkdirSync, readdirSync, symlink } from 'fs';
import * as inquirer from 'inquirer';
import cli from 'cli-ux';
import {
  deleteProject,
  // goToDirectory,
  openWithVSCode,
  revealInFinder,
} from './utils/actions';
import { basePath, getProjectName } from './utils/paths';
import { ITask } from 'cli-ux/lib/action/base';

inquirer.registerPrompt('search-list', require('inquirer-search-list'));

enum SubCommands {
  add = 'add',
}

class Gwr extends Command {
  static description =
    'GWR, a CLI that makes it easy to open projects anywhere.';

  static args = [
    {
      name: 'subcommands',
      options: Object.values(SubCommands),
      required: false,
      description: 'Subcommands which able to use',
    },
  ];

  static flags: flags.Input<any> = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
  };

  static initStore() {
    if (!existsSync(basePath)) {
      mkdirSync(basePath);
    }
  }

  async add() {
    exec('pwd', (err, currentDir) => {
      if (err) {
        return;
      }

      const projectName = getProjectName(currentDir);
      const dest = `${basePath}/${projectName}`;
      symlink(currentDir.trim(), dest.trim(), 'junction', (err) => {
        if (err) {
          this.warn('Project already added');
        } else {
          this.log('Project added successfully');
        }
      });
    });
  }

  async getList() {
    const projectList = readdirSync(basePath, { withFileTypes: true })
      .filter((dirent) => dirent.isSymbolicLink())
      .map(({ name }) => name);

    if (!projectList.length) {
      this.log(
        `You still don't have any projects added to GWR\nPlease go to your project folder and run the command below:`,
      );
      this.log(`\n> gwr add\n`);
      return;
    }

    const { projectName } = await inquirer.prompt([
      {
        name: 'projectName',
        message: 'Select project',
        type: 'search-list',
        choices: projectList,
      },
    ]);

    const { action } = await inquirer.prompt([
      {
        name: 'action',
        message: 'What you want to do?',
        type: 'list',
        choices: [
          // { name: 'Go to directory', value: 0 },
          { name: 'Open with Visual Studio Code', value: 1 },
          { name: 'Reveal in finder', value: 2 },
          { name: 'Delete this project from GWR', value: 3 },
        ],
      },
    ]);

    const projectDir = basePath + '/' + projectName;
    switch (action) {
      // case 0:
      //   goToDirectory(projectDir).then(() => {
      //     cli.action.start(`Going to ${projectName} directory`);
      //   });
      //   break;

      case 1:
        openWithVSCode(projectDir).then(() => {
          cli.action.start(`Opening ${projectName} with Visual Studio Code`);
        });
        break;

      case 2:
        revealInFinder(projectDir).then(() => {
          cli.action.start(`Reveal ${projectName} in Finder`);
        });
        break;

      case 3:
        deleteProject(projectDir, () => {
          cli.action.start(`Deleting ${projectName} from GWR`);
        });

      default:
        break;
    }
  }

  async run() {
    Gwr.initStore();
    const { args } = this.parse(Gwr);

    if (args.subcommands === SubCommands.add) {
      this.add();
    } else {
      this.getList();
    }
  }
}

export = Gwr;
