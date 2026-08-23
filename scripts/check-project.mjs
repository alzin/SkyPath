import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { parse as parseYaml } from 'yaml';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const requiredFiles = [
  '.editorconfig',
  '.gitattributes',
  '.htmlvalidate.json',
  '.github/CODEOWNERS',
  '.github/ISSUE_TEMPLATE/bug_report.yml',
  '.github/ISSUE_TEMPLATE/config.yml',
  '.github/ISSUE_TEMPLATE/feature_request.yml',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/dependabot.yml',
  '.github/workflows/ci.yml',
  '.github/workflows/pages.yml',
  '.gitignore',
  'CODE_OF_CONDUCT.md',
  'CONTRIBUTING.md',
  'LICENSE',
  'README.md',
  'SECURITY.md',
  'docs/skypath-preview.png',
  'docs/skypath-social.png',
  'favicon.svg',
  'index.html',
  'package.json'
];

const failures = [];

for (const relativePath of requiredFiles) {
  try {
    await access(resolve(root, relativePath), constants.R_OK);
  } catch {
    failures.push(`Missing required file: ${relativePath}`);
  }
}

const yamlFiles = requiredFiles.filter((relativePath) => /\.ya?ml$/i.test(relativePath));
for (const relativePath of yamlFiles) {
  try {
    parseYaml(await readFile(resolve(root, relativePath), 'utf8'));
  } catch (error) {
    failures.push(`Invalid YAML in ${relativePath}: ${error.message}`);
  }
}

const html = await readFile(resolve(root, 'index.html'), 'utf8');

const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi)];
if (inlineScripts.length === 0) {
  failures.push('No inline application script was found in index.html.');
}

for (const [index, match] of inlineScripts.entries()) {
  try {
    new vm.Script(match[1], { filename: `index.html:inline-script-${index + 1}` });
  } catch (error) {
    failures.push(`Inline JavaScript ${index + 1} does not compile: ${error.message}`);
  }
}

const threeScript = html.match(/<script\b[^>]*src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\/three\.min\.js"[^>]*><\/script>/i)?.[0];
if (!threeScript) {
  failures.push('The pinned Three.js r128 script tag is missing.');
} else {
  const expectedIntegrity = 'integrity="sha384-CI3ELBVUz9XQO+97x6nwMDPosPR5XvsxW2ua7N1Xeygeh1IxtgqtCkGfQY9WWdHu"';
  if (!threeScript.includes(expectedIntegrity)) {
    failures.push('The Three.js Subresource Integrity hash is missing or unexpected.');
  }
  if (!threeScript.includes('crossorigin="anonymous"')) {
    failures.push('The Three.js script must use anonymous CORS for integrity verification.');
  }
}

if (!html.includes('http-equiv="Content-Security-Policy"')) {
  failures.push('index.html is missing its Content Security Policy.');
}

const insecureResources = [...html.matchAll(/\b(?:href|src)="(http:\/\/[^\"]+)"/gi)].map((match) => match[1]);
if (insecureResources.length > 0) {
  failures.push(`Insecure HTTP resources found: ${insecureResources.join(', ')}`);
}

if (failures.length > 0) {
  console.error('Project validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Project validation passed (${requiredFiles.length} required files, ${yamlFiles.length} YAML files, ${inlineScripts.length} inline script).`);
}
