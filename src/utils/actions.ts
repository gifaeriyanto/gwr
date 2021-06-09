import { cli } from 'cli-ux';
import { unlink } from 'fs';

export const goToDirectory = (dir: string) => {
  cli.open(`cd ${dir}`);
};

export const openWithVSCode = (dir: string) => {
  return cli.open(dir, {
    app: 'Visual Studio Code',
  });
};

export const revealInFinder = (dir: string) => {
  return cli.open(dir);
};

export const deleteProject = (
  dir: string,
  callback: (err: NodeJS.ErrnoException | null) => void,
) => {
  unlink(dir, callback);
};
