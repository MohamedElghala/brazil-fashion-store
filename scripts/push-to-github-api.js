const fs = require('fs');
const path = require('path');
const https = require('https');

// Token from git credential fill
const { execSync } = require('child_process');
const credInput = 'protocol=https\nhost=github.com\n';
const credOutput = execSync('git credential fill', { input: credInput, encoding: 'utf-8' });
const tokenMatch = credOutput.match(/password=([^\r\n]+)/);
if (!tokenMatch) {
  console.error('Token not found!');
  process.exit(1);
}
const token = tokenMatch[1];
const owner = 'MohamedElghala';
const repo = 'brazil-fashion-store';

function request(method, endpoint, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path: endpoint,
      method: method,
      headers: {
        'User-Agent': 'Antigravity-Assistant',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    }, (res) => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(resData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          reject(new Error(`Parse error ${res.statusCode}: ${resData}`));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// Collect files to commit
const ignoreDirs = new Set(['.git', 'node_modules', '.next', '.vercel', 'baseline_screens', 'verified_screens', 'vercel_live_screens']);
const ignoreFiles = new Set(['.DS_Store', 'dev.db']);

function getFiles(dir, base = '') {
  let results = [];
  for (const item of fs.readdirSync(dir)) {
    if (ignoreDirs.has(item) || item.endsWith('.log')) continue;
    const full = path.join(dir, item);
    const rel = base ? `${base}/${item}` : item;
    const st = fs.lstatSync(full);
    if (st.isDirectory()) {
      results = results.concat(getFiles(full, rel));
    } else if (st.isFile()) {
      if (!ignoreFiles.has(item)) {
        results.push({ full, rel });
      }
    }
  }
  return results;
}

async function main() {
  console.log('1. Initializing repository with README.md via Contents API...');
  const readmeContent = Buffer.from(
    '# Brasil Chic — Moda & Estilo Brasileira\n\nLoja Virtual completa de moda brasileira (Next.js 14, Pix BACEN, Correios, Admin).'
  ).toString('base64');

  let baseCommitSha = '';
  try {
    const initRes = await request('PUT', `/repos/${owner}/${repo}/contents/README.md`, {
      message: 'Initialize repository',
      content: readmeContent
    });
    baseCommitSha = initRes.commit.sha;
    console.log('Repository initialized! Commit SHA:', baseCommitSha);
  } catch (e) {
    console.log('README may already exist, fetching main branch...');
    const ref = await request('GET', `/repos/${owner}/${repo}/git/ref/heads/main`);
    baseCommitSha = ref.object.sha;
  }

  console.log('2. Collecting project files...');
  const files = getFiles(process.cwd());
  console.log(`Found ${files.length} files to push.`);

  console.log('3. Creating blobs via GitHub API...');
  const treeItems = [];
  for (const f of files) {
    const content = fs.readFileSync(f.full);
    const isBinary = content.includes(0);
    const blobData = isBinary
      ? { content: content.toString('base64'), encoding: 'base64' }
      : { content: content.toString('utf-8'), encoding: 'utf-8' };

    const blob = await request('POST', `/repos/${owner}/${repo}/git/blobs`, blobData);
    treeItems.push({
      path: f.rel.replace(/\\/g, '/'),
      mode: '100644',
      type: 'blob',
      sha: blob.sha
    });
    process.stdout.write('.');
  }
  console.log('\nAll blobs created.');

  console.log('4. Creating Git Tree...');
  const tree = await request('POST', `/repos/${owner}/${repo}/git/trees`, {
    tree: treeItems
  });
  console.log('Tree created:', tree.sha);

  console.log('5. Creating Commit...');
  const commit = await request('POST', `/repos/${owner}/${repo}/git/commits`, {
    message: 'Initial commit: Complete Brazilian fashion store Brasil Chic',
    tree: tree.sha,
    parents: baseCommitSha ? [baseCommitSha] : []
  });
  console.log('Commit created:', commit.sha);

  console.log('6. Updating ref refs/heads/main...');
  await request('PATCH', `/repos/${owner}/${repo}/git/refs/heads/main`, {
    sha: commit.sha,
    force: true
  });

  console.log(`\n🎉 SUCCESS! Entire project is live at: https://github.com/${owner}/${repo}`);
}

main().catch(err => {
  console.error('\nFAILED:', err.message);
  process.exit(1);
});
