import { exec, ExecException } from 'child_process';
import { unlink } from 'fs';
import { type } from 'os';

export const openWithVSCode = (
  dir: string,
  callback?: (
    err: ExecException | null,
    stdout: string,
    stderr: string,
  ) => void,
) => {
  exec(`code ${dir}`, (err, stdout, stderr) => {
    if (err) {
      switch (type()) {
        case 'Darwin':
          exec(`open -a "Visual Studio Code" ${dir}`, callback);
          break;

        default:
          break;
      }
    } else {
      callback && callback(err, stdout, stderr);
    }
  });
};

export const revealInFinder = (
  dir: string,
  callback?: (
    err: ExecException | null,
    stdout: string,
    stderr: string,
  ) => void,
) => {
  switch (type()) {
    case 'Darwin':
      exec(`open ${dir}`, callback);
      break;

    case 'Windows_NT':
      exec(`start ${dir}`, callback);
      break;

    case 'Linux':
      exec(`xdg-open ${dir}`, callback);

    default:
      break;
  }
};

export const deleteProject = (
  dir: string,
  callback: (err: NodeJS.ErrnoException | null) => void,
) => {
  unlink(dir, callback);
};
