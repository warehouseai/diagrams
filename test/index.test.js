const childProcess = require('child_process');
const { describe, it } = require('mocha');
const assume = require('assume');
const util = require('util');
const path = require('path');
const fs = require('fs');

const exec = util.promisify(childProcess.exec);
const readFile = util.promisify(fs.readFile);
const stat = util.promisify(fs.stat);

describe('Warehouse diagrams', function () {
  const bin = path.join(__dirname, '..', 'index.js');
  const timeout = 2E4;

  this.timeout(timeout);

  it('generates images from mermaid diagram definitions', async function () {
    const { stderr } = await exec(`node ${ bin } --target=./fixtures --source=./fixtures`, {
      cwd: __dirname
    });

    assume(stderr).to.equal('');

    const stats = await stat(path.join(__dirname, 'fixtures', 'build.png'));

    assume(stats).to.be.an('object');
    assume(stats.size).to.be.gt(5E4);
    assume(stats.mtimeMs).to.be.gt(Date.now() - timeout);
  });

  it('can output static html for debugging', async function () {
    const { stderr } = await exec(`node ${ bin } --target=./fixtures --source=./fixtures`, {
      cwd: __dirname,
      env: {
        DEBUG: true
      }
    });

    assume(stderr).to.equal('');

    const html = await readFile(path.join(__dirname, 'fixtures', 'build.html'), {
      encoding: 'utf-8'
    });

    assume(html).to.include('B --> |"enqueue build"|C');
    assume(html).to.include('document.body.appendChild(diagram);');
    assume(html).to.include('mermaidAPI.render(\'container\', `graph LR');
  });
});
