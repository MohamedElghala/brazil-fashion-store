const fs = require('fs');
const path = require('path');

function dereferenceDir(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    try {
      const stat = fs.lstatSync(fullPath);

      if (stat.isSymbolicLink()) {
        const realTarget = fs.realpathSync(fullPath);
        console.log(`Substituindo symlink: ${fullPath} -> ${realTarget}`);
        fs.unlinkSync(fullPath);

        const targetStat = fs.statSync(realTarget);
        if (targetStat.isDirectory()) {
          fs.cpSync(realTarget, fullPath, { recursive: true });
        } else {
          fs.copyFileSync(realTarget, fullPath);
        }
      } else if (stat.isDirectory()) {
        dereferenceDir(fullPath);
      }
    } catch (err) {
      console.error(`Erro ao processar ${fullPath}:`, err.message);
    }
  }
}

const outputDir = path.join(process.cwd(), '.vercel', 'output');
console.log('Iniciando desreferenciação de symlinks em:', outputDir);
dereferenceDir(outputDir);
console.log('Todos os symlinks foram convertidos em pastas reais com sucesso!');
