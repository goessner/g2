const tmpl = module.exports = {
  // article layout ... used by other templates
  page(data) {
    return `<!doctype html>
  <html class="theme-light">
  <head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, user-scalable=no">
  <meta name="description" content="${data.description || (data.title + ' - microjam page')}">
  ${data.date ? `<meta name="date" content="${new Date(data.date).toString()}">` : ''}
  ${data.tags ? `<meta name="keywords" content="${data.tags.join()}">` : ''}
  <title>${data.title}</title>
  <link rel="shortcut icon" type="image/png" href="${data.base}/img/favicon.png">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@9.18.1/styles/vs2015.min.css">
  ${data.math ? `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/markdown-it-texmath/css/texmath.css">` : ''}
  <link rel="stylesheet" href="${data.base}/theme/styles.css">
  </head>
  <body id="top">
  <header>
  <a href="${data.base}/index.html" class="right">g²</a>
  <a href="${data.base}/${data.reluri}.html" class="left">${data.header}</a>
  <a href="https://github.com/goessner/g2"">
    <svg height="32" viewBox="0 0 16 16" width="32"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"></path></svg>
  </a>
  </header>
  <main>
    <nav>
       ${data.uses && data.uses.find((use) => use.uri === 'navigation.md').content || 'no navigation data !'}
    </nav>
    <article>
  ${data.content}
    </article>
  </main>
  <footer>
    <span class="left">&copy; goessner</span>
    <span class="center">powered by &mu;Jam &amp; VSCode &mdash; hosted by GitHub</span>
    <span class="right" onclick="document.documentElement.className = document.documentElement.className === 'theme-dark' ? 'theme-light' : 'theme-dark';">&#9788;</span>
  </footer>
  </body>
  </html>`
  }
  
  }