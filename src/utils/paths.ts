import { homedir } from 'os';

export const basePath = homedir() + '/.gwr';

export const getProjectName = (dir: string) => {
  const dirSplitted = dir.split('/');
  const projectName = dirSplitted[dirSplitted.length - 1];
  return projectName;
};
