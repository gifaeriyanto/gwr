# gwr

GWR, a CLI that makes it easy to open projects anywhere.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gwr.svg)](https://npmjs.org/package/gwr)
[![Downloads/week](https://img.shields.io/npm/dw/gwr.svg)](https://npmjs.org/package/gwr)
[![License](https://img.shields.io/npm/l/gwr.svg)](https://github.com/gifaeriyanto/gwr/blob/master/package.json)

<!-- toc -->

- [gwr](#gwr)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

## Installation

```
npm install -g gwr
```

## Examples (Run it and see it)

### Add Project

Go to your project folder and run the command below:

```sh-session
gwr add
```

### List

Run the command below anywhere:

```sh-session
gwr
```

And then, you will see prompts like this:

```sh-session
✔︎ ~ gwr
? Select project
❯ project-1
  project-2
  project-3
```

```
? What you want to do? (Use arrow keys)
❯ Open with Visual Studio Code
  Reveal in finder
  Delete this project from GWR
```

<!-- usagestop -->

# Commands

<!-- commands -->

`gwr` get project list

`gwr add` add project (must be in the project folder you want to add)

<!-- commandsstop -->
