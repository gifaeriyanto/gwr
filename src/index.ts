import { Command, flags } from '@oclif/command';
import { exec } from 'child_process';
import { existsSync, mkdirSync, readdirSync, symlink } from 'fs';
import { homedir } from 'os';
import * as inquirer from 'inquirer';
import cli from 'cli-ux';

enum SubCommands {
  add = 'add',
  delete = 'delete',
}

class Wr extends Command {
  static dir: string = homedir() + '/.wr';
  static description = 'Shortcut to your projects';

  static args = [
    {
      name: 'subcommands',
      options: Object.values(SubCommands),
      required: false,
    },
  ];

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
  };

  static initStore() {
    if (!existsSync(this.dir)) {
      mkdirSync(this.dir);
    }
  }

  async add() {
    exec('pwd', (err, currentDir) => {
      if (err) {
        return;
      }

      const currentDirSplitted = currentDir.split('/');
      const projectName = currentDirSplitted[currentDirSplitted.length - 1];
      const dest = `${Wr.dir}/${projectName}`;
      symlink(currentDir.trim(), dest.trim(), 'junction', (err) => {
        if (err) {
          this.warn('Project already added');
        } else {
          this.log('Project added successfully');
        }
      });
    });
  }

  static openWithVSCode(dir: string) {
    exec(`code ${dir}`);
  }

  static revealInFinder(dir: string) {
    exec(`open ${dir}`);
  }

  async getList() {
    const projectList = readdirSync(Wr.dir, { withFileTypes: true })
      .filter((dirent) => dirent.isSymbolicLink())
      .map(({ name }) => name);
    const { projectName } = await inquirer.prompt([
      {
        name: 'projectName',
        message: 'Select project',
        type: 'list',
        choices: projectList,
      },
    ]);

    const { action } = await inquirer.prompt([
      {
        name: 'action',
        message: 'What you want to do?',
        type: 'list',
        choices: [
          { name: 'Open with Visual Studio Code', value: 0 },
          { name: 'Reveal in finder', value: 1 },
          { name: 'Delete this project from Wr', value: 2 },
        ],
      },
    ]);

    switch (action) {
      case 0:
        Wr.openWithVSCode(Wr.dir + '/' + projectName);
        cli.action.start(`Opening ${projectName} with Visual Studio Code`);
        break;

      case 1:
        Wr.revealInFinder(Wr.dir + '/' + projectName);
        cli.action.start(`Reveal ${projectName} in Finder`);
        break;

      default:
        break;
    }
  }

  async run() {
    Wr.initStore();
    const { args } = this.parse(Wr);

    if (args.subcommands === SubCommands.add) {
      this.add();
    } else {
      this.getList();
    }
  }
}

export = Wr;
