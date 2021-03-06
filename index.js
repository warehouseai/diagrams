#!/usr/bin/env node

const argh = require('argh')(process.argv);
const template = require('./template');
const canihaz = require('canihaz');
const path = require('path');
const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readdir = util.promisify(fs.readdir);

//
// Keep singleton reference to spawned browser instance.
//
let browser;

//
// Parse options from the CLI.
//
const sourceDir = path.resolve(process.cwd(), argh.source || 'diagrams');
const targetDir = path.resolve(process.cwd(), argh.target || 'assets');

async function snapshot(file) {
  try {
    const chart = await readFile(path.join(sourceDir, file), 'utf-8');
    const output = {
      png: `${ path.basename(file, '.mmd') }.png`,
      html: `${ path.basename(file, '.mmd') }.html`
    };

    console.log(`[${ file }]  Render to string`);
    const rendered = template(chart, argh.theme);

    if (process.env.DEBUG) {
      console.log(`[${output.html}] Write file`);
      await writeFile(path.join(targetDir, output.html), rendered, 'utf8');
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setContent(rendered, { waitUntil: ['networkidle0'] });

    const clip = await page.$eval('svg', svg => {
      const box = svg.getBoundingClientRect();
      return { x: box.left, y: box.top, width: box.width, height: box.height };
    });

    console.log(`[${output.png}]  Screenshot result`);
    await page.screenshot({ path: path.join(targetDir, output.png), clip, omitBackground: true });
  } catch (error) {
    throw new Error(`Snapshot of diagram failed: ${ error.message }`);
  }
}

console.log('Requesting availability of puppeteer, it will be installed if unavailable.');

canihaz({
  key: 'cliDependencies'
}).puppeteer(async function puppetmaster(error, puppeteer) {
  if (error) throw error;

  let files = argh.file;
  if (files && !Array.isArray(files)) files = [argh.file];

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const diagrams = files
      ? files.map(file => path.extname(file) === '.mmd' ? file : `${ file }.mmd`)
      : await readdir(sourceDir);

    for (const file of diagrams) {
      if (path.extname(file) === '.mmd') await snapshot(file);
    }

    await browser.close();

    console.log('Chart images generated.');
  } catch (err) {
    throw new Error(`Puppeteer failed: ${ err.message }`);
  }
});

//
// Ensure Chromium process is closed.
//
process.once('SIGINT', async function kill() {
  if (!browser) process.exit();
  await browser.close();
});
