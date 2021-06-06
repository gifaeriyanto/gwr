import { Command, flags } from '@oclif/command';
import { exec, ExecException } from 'child_process';
import { existsSync, fstat, mkdirSync, readdirSync, symlink, unlink } from 'fs';
import { homedir } from 'os';
import * as inquirer from 'inquirer';
import cli from 'cli-ux';

enum SubCommands {
  add = 'add',
}

class Wr extends Command {
  static dir: string = homedir() + '/.wr';
  static description =
    'WR, a CLI that makes it easy for us to open projects anywhere.';

  static args = [
    {
      name: 'subcommands',
      options: Object.values(SubCommands),
      required: false,
      description: 'Subcommands which able to use',
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

  static openWithVSCode(
    dir: string,
    callback?: (
      err: ExecException | null,
      stdout: string,
      stderr: string,
    ) => void,
  ) {
    exec(`code ${dir}`, callback);
  }

  static revealInFinder(
    dir: string,
    callback?: (
      err: ExecException | null,
      stdout: string,
      stderr: string,
    ) => void,
  ) {
    exec(`open ${dir}`, callback);
  }

  static deleteProject(
    dir: string,
    callback: (err: NodeJS.ErrnoException | null) => void,
  ) {
    unlink(dir, callback);
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
          { name: 'Delete this project from WR', value: 2 },
        ],
      },
    ]);

    const projectDir = Wr.dir + '/' + projectName;
    switch (action) {
      case 0:
        Wr.openWithVSCode(projectDir, () => {
          cli.action.start(`Opening ${projectName} with Visual Studio Code`);
        });
        break;

      case 1:
        Wr.revealInFinder(projectDir, () => {
          cli.action.start(`Reveal ${projectName} in Finder`);
        });
        break;

      case 2:
        Wr.deleteProject(projectDir, () => {
          cli.action.start(`Deleting ${projectName} from WR`);
        });

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
