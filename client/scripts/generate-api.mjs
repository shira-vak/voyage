import { get } from 'http';
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

const SPEC_URL = 'http://localhost:3000/api-json';
const SPEC_OUT = 'src/api/openapi.json';
const CLIENT_OUT = 'src/api/generated';

get(SPEC_URL, (res) => {
  let raw = '';
  res.on('data', (chunk) => (raw += chunk));
  res.on('end', () => {
    writeFileSync(SPEC_OUT, raw);
    execSync(`npx openapi --input ${SPEC_OUT} --output ${CLIENT_OUT} --client fetch`, { stdio: 'inherit' });
  });
}).on('error', (err) => {
  console.error(`Could not reach ${SPEC_URL} — is the server running?\n${err.message}`);
  process.exit(1);
});
