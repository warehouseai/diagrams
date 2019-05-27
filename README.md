# `@wrhs/diagrams`

[![Version npm](https://img.shields.io/npm/v/@wrhs/diagrams.svg?style=flat-square)](https://www.npmjs.com/package/diagrams)
[![License](https://img.shields.io/npm/l/@wrhs/diagrams.svg?style=flat-square)](https://github.com/warehouseai/diagrams/blob/master/LICENSE)
[![npm Downloads](https://img.shields.io/npm/dm/@wrhs/diagrams.svg?style=flat-square)](https://npmcharts.com/compare/diagrams?minimal=true)
[![Dependencies](https://img.shields.io/david/warehouseai/diagrams.svg?style=flat-square)](https://github.com/warehouseai/diagrams/blob/master/package.json)
[![CircleCI](https://circleci.com/gh/warehouseai/diagrams.svg?style=svg)](https://circleci.com/gh/warehouseai/diagrams)

Utility to generate consistent [Mermaid] diagrams for [Warehouse.ai] modules.

## Install

```sh
npm install @wrhs/diagrams --save-dev
```

## Usage

The easiest way to use this tool is by adding an `npm` command to the
consuming module's `package.json`

```json
"scripts": {
  "diagrams": "wrhs-diagrams --target=./docs --theme=forest"
  ...
},
```

This command can then be used from the consuming module by running

```sh
npm run diagrams
```

## API

The tool uses puppeteer with [Mermaid's API][Mermaid] to generate `svg's` from
the `.mmd` diagram definitions. [`canihaz`][canihaz] will install [Puppeteer]
the first time this tool is used. It only has a single command,
but it supports the following flags.

- **--source**: Relative path to directory with `.mmd` source files.
- **--target**: Relative path to directory to store `.png` output files.
- **--file**: Relative path to source files `--file one.mmd --file two.mmd`.
- **--theme**: Theme to be used for diagram styling, defaults to `forest`.

_Note: If you need to assert the HTML used in [Puppeteer] to generate the
chart set `DEBUG=true` to have the script output both an `.png` and `.html`
file._

## Test

```sh
npm test
```

[Mermaid]: http://mermaidjs.github.io/
[canihaz]: https://github.com/3rd-Eden/canihaz
[Puppeteer]: https://pptr.dev/
[Warehouse.ai]: https://github.com/godaddy/warehouse.ai/
