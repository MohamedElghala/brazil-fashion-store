const fs = require('fs');
const path = require('path');

const rootNextServer = path.join(process.cwd(), '.next', 'server');
const functionsDir = path.join(process.cwd(), '.vercel', 'output', 'functions');

console.log('Verificando funções em:', functionsDir);
console.log('Root .next/server:', rootNextServer);

// Subfolders that have backslash symlinks to ..\_not-found.func
const subfolders = ['categoria', 'pedido', 'produto'];

for (const sub of subfolders) {
  const subDir = path.join(functionsDir, sub);
  if (!fs.existsSync(subDir)) continue;

  const entries = fs.readdirSync(subDir);
  for (const entry of entries) {
    const fullPath = path.join(subDir, entry);
    const stat = fs.lstatSync(fullPath);

    if (stat.isSymbolicLink()) {
      const realTarget = fs.realpathSync(fullPath);
      console.log(`Convertendo symlink de subpasta para pasta real: ${sub}/${entry} -> ${realTarget}`);
      fs.unlinkSync(fullPath);
      fs.cpSync(realTarget, fullPath, { recursive: true });
    }
  }
}

// Check api/[...route].rsc.func
const apiRsc = path.join(functionsDir, 'api', '[...route].rsc.func');
if (fs.existsSync(apiRsc)) {
  const stat = fs.lstatSync(apiRsc);
  if (stat.isSymbolicLink()) {
    const realTarget = fs.realpathSync(apiRsc);
    console.log(`Convertendo api rsc symlink para pasta real: ${apiRsc} -> ${realTarget}`);
    fs.unlinkSync(apiRsc);
    fs.cpSync(realTarget, apiRsc, { recursive: true });
  }
}

// Populate .next/server dependencies (app, chunks, pages, webpack-runtime.js) into all real .func folders
function populateServerFiles(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const st = fs.lstatSync(full);
    if (!st.isSymbolicLink() && st.isDirectory()) {
      if (f.endsWith('.func')) {
        const targetServer = path.join(full, '.next', 'server');
        if (fs.existsSync(targetServer)) {
          // Copy chunks
          const targetChunks = path.join(targetServer, 'chunks');
          const srcChunks = path.join(rootNextServer, 'chunks');
          if (fs.existsSync(srcChunks) && !fs.existsSync(targetChunks)) {
            fs.cpSync(srcChunks, targetChunks, { recursive: true });
          }
          // Copy app
          const targetApp = path.join(targetServer, 'app');
          const srcApp = path.join(rootNextServer, 'app');
          if (fs.existsSync(srcApp) && !fs.existsSync(targetApp)) {
            fs.cpSync(srcApp, targetApp, { recursive: true });
          }
          // Copy pages
          const targetPages = path.join(targetServer, 'pages');
          const srcPages = path.join(rootNextServer, 'pages');
          if (fs.existsSync(srcPages) && !fs.existsSync(targetPages)) {
            fs.cpSync(srcPages, targetPages, { recursive: true });
          }
          // Copy webpack-runtime.js
          const targetWebpack = path.join(targetServer, 'webpack-runtime.js');
          const srcWebpack = path.join(rootNextServer, 'webpack-runtime.js');
          if (fs.existsSync(srcWebpack) && !fs.existsSync(targetWebpack)) {
            fs.copyFileSync(srcWebpack, targetWebpack);
          }
        }
      }
      populateServerFiles(full);
    }
  }
}

populateServerFiles(functionsDir);

// Count total physical .func directories
let count = 0;
function countRealFuncs(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const st = fs.lstatSync(full);
    if (!st.isSymbolicLink() && st.isDirectory()) {
      if (f.endsWith('.func')) {
        count++;
        console.log(`Real func [${count}]:`, path.relative(functionsDir, full));
      }
      countRealFuncs(full);
    }
  }
}

countRealFuncs(functionsDir);
console.log(`Total de funções físicas reais: ${count} (limite Vercel anonymous: 20)`);
