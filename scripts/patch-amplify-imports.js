const fs = require('fs');
const path = require('path');

const f = path.join(__dirname, '..', 'amplify', 'backend.mjs');
let s = fs.readFileSync(f, 'utf8');
s = s.replace(/from "(\.\/[^"]+)"/g, (match, p) => {
  return path.extname(p) ? match : `from "${p}.mjs"`;
});
fs.writeFileSync(f, s);
console.log('amplify/backend.mjs: patched import extensions → .mjs');
