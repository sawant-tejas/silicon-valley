const https = require('https');

https.get('https://hack2future.iiitdwd.ac.in/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const regex = /(?:src|href|url)\s*=\s*['"]?([^'"\s>]+(?:png|jpe?g|webp|svg|gif))['"]?/gi;
    let match;
    const urls = new Set();
    while ((match = regex.exec(data)) !== null) {
      urls.add(match[1]);
    }
    console.log(Array.from(urls).join('\n'));
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
