/**
 * Removes bundled graphql copies from @aws-amplify packages so Node.js
 * resolves the single root graphql install during CDK synthesis.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'node_modules');

const bundledCopies = [
  path.join(root, '@aws-amplify', 'data-construct', 'node_modules', 'graphql'),
  path.join(root, '@aws-amplify', 'graphql-api-construct', 'node_modules', 'graphql'),
];

for (const target of bundledCopies) {
  try {
    if (!fs.existsSync(target)) continue;
    const stat = fs.lstatSync(target);
    if (stat.isSymbolicLink()) {
      fs.unlinkSync(target);
      console.log('graphql patch (removed symlink):', path.relative(root, target));
    } else {
      fs.rmSync(target, { recursive: true, force: true });
      console.log('graphql patch (removed dir):', path.relative(root, target));
    }
  } catch (e) {
    console.warn('graphql patch skipped for', target, ':', e.message);
  }
}
