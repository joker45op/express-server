

const template = readFileSync('testt.ejs', 'utf8');
const data = { tagline: 'Welcome to my website!' };

render(template, data, (err, html) => {
  if (err) throw err;

  // Pass the rendered HTML content back to the server-side
  saveHtml(html);
});

function saveHtml(html) {
  // Save the HTML content to a file on the server-side
  writeFile('output4.pdf', html, (err) => {
    if (err) throw err;
    console.log('HTML saved!');
  });
}
