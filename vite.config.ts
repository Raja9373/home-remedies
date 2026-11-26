import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const UNBUNDLED_STATIC_FILES = [
  'condition.html', 'remedies.js', 'remedies-part1.js', 'remedies-part2.js',
  'acupressure.html', 'acupressure.js', 'acupressure-part1.js', 'acupressure-part2.js', 'all-points.html',
  'mudra.html', 'mudra.js', 'mudra-part1.js', 'mudra-part2.js', 'all-mudras.html',
  'aaj-ka-nuskha.js', 'site-core.js', 'poocho.html', 'bhejo.html', 'ingredients.html', 'compare.html',
  'contact.html', 'about.html', 'privacy-policy.html', 'disclaimer.html', 'terms.html',
] as const;

function copyRecursiveSync(src: string, dest: string): void {
  if (!fs.existsSync(src)) {
    return;
  }

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, {recursive: true});
    if (typeof fs.cpSync === 'function') {
      fs.cpSync(src, dest, {recursive: true, force: true});
      return;
    }
    for (const entry of fs.readdirSync(src, {withFileTypes: true})) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyRecursiveSync(srcPath, destPath);
      } else {
        fs.mkdirSync(path.dirname(destPath), {recursive: true});
        fs.copyFileSync(srcPath, destPath);
      }
    }
    return;
  }

  fs.mkdirSync(path.dirname(dest), {recursive: true});
  fs.copyFileSync(src, dest);
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Copies src/assets and standalone static pages/scripts into dist/
      // using Node built-in fs APIs (zero extra deps) and auto-updates build metadata.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(rootDir, 'dist');
          if (!fs.existsSync(distDir)) {
            return;
          }

          copyRecursiveSync(
            path.resolve(rootDir, 'src/assets'),
            path.resolve(distDir, 'src/assets'),
          );

          for (const file of UNBUNDLED_STATIC_FILES) {
            copyRecursiveSync(
              path.resolve(rootDir, file),
              path.resolve(distDir, file),
            );
          }

          // Auto-stamp version.json, sw.js cache key, and sitemap.xml lastmod on every build
          const now = new Date();
          const version = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
          const todayIso = now.toISOString().slice(0, 10);

          fs.writeFileSync(
            path.resolve(distDir, 'version.json'),
            JSON.stringify({version, builtAt: now.toISOString(), year: now.getFullYear()}, null, 2) + '\n',
          );

          const distSwPath = path.resolve(distDir, 'sw.js');
          if (fs.existsSync(distSwPath)) {
            const swContent = fs.readFileSync(distSwPath, 'utf8').replace(
              /const CACHE_VERSION = '[^']+';/,
              `const CACHE_VERSION = 'hrw-v${version}';`,
            );
            fs.writeFileSync(distSwPath, swContent);
          }

          const distSitemapPath = path.resolve(distDir, 'sitemap.xml');
          if (fs.existsSync(distSitemapPath)) {
            const smContent = fs.readFileSync(distSitemapPath, 'utf8').replace(
              /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
              `<lastmod>${todayIso}</lastmod>`,
            );
            fs.writeFileSync(distSitemapPath, smContent);
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': rootDir,
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
