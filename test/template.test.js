const { describe, it } = require('mocha');
const template = require('../template');
const assume = require('assume');

describe('Diagram template', function () {
  it('provides static HTML to render in puppeteer', function () {
    const result = template('<svg><path d="im a chart"></svg>', 'test');

    assume(result).to.include('/font-awesome/5.8.1/css/all.min.css');
    assume(result).to.include('<script src="https://unpkg.com/mermaid/dist/mermaid.min.js"></script>');

    assume(result).to.include('mermaidAPI.initialize({ theme: `test` })');
    assume(result).to.include('mermaidAPI.render(\'container\', `<svg><path d="im a chart"></svg>`');
    assume(result).to.include('document.body.appendChild(diagram);');
  });
});
