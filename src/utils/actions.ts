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
  if (type() === 'Darwin') {
    exec(`open -a "Visual Studio Code" ${dir}`, callback);
  }
};

export const revealInFinder = (
  dir: string,
  callback?: (
    err: ExecException | null,
    stdout: string,
    stderr: string,
  ) => void,
) => {
  exec(`open ${dir}`, callback);
};

export const deleteProject = (
  dir: string,
  callback: (err: NodeJS.ErrnoException | null) => void,
) => {
  unlink(dir, callback);
};
