module.exports = (chart, theme = 'forest') => `
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/css/all.min.css">
    <style>
      html, * {
        font-family: 'monaco';
      }

      .node {
        text-align: center;
      }

      i.fa {
        display: block;
        margin: 5px;
      }

      .edgeLabel:not(:empty) {
        padding: 0px 8px;
      }
    </style>
  </head>
  <body>
    <script src="https://unpkg.com/mermaid/dist/mermaid.min.js"></script>
    <script>
      const diagram = document.createElement('div');

      window.mermaid.mermaidAPI.initialize({ theme: \`${theme}\` });
      window.mermaid.mermaidAPI.render('container', \`${chart}\`, svg => {
        diagram.innerHTML = svg;
        diagram.id = 'container';

        document.body.appendChild(diagram);
      });
    </script>
  </body>
</html>
`;
