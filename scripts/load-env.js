const fs = require('fs');
const path = require('path');

const envDir = path.resolve(__dirname, '..', 'src', 'environment');
const prodPath = path.join(envDir, 'environment.ts');
const devPath = path.join(envDir, 'environment.dev.ts');

// 1. Читаем .env файл если есть
const envPath = path.resolve(__dirname, '..', '.env');
const fileEnv = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    fileEnv[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  });
}

// 2. process.env приоритетнее чем .env файл (для деплоа)
const vars = {
  BASE_URL: process.env.BASE_URL || fileEnv.BASE_URL,
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || fileEnv.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || fileEnv.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || fileEnv.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || fileEnv.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || fileEnv.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || fileEnv.FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID || fileEnv.FIREBASE_MEASUREMENT_ID,
  CLOUDFLARE_WORKER_URL: process.env.CLOUDFLARE_WORKER_URL || fileEnv.CLOUDFLARE_WORKER_URL,
};

function buildEnvTs(mode) {
  return `// Generated from .env by scripts/load-env.js — created once, then never overwritten.
// Правьте вручную: файл больше не перезаписывается автоматически.
export const environment = {
  mode: '${mode}',
  baseUrl: '${vars.BASE_URL}',
  firebaseConfig: {
    apiKey: '${vars.FIREBASE_API_KEY}',
    authDomain: '${vars.FIREBASE_AUTH_DOMAIN}',
    projectId: '${vars.FIREBASE_PROJECT_ID}',
    storageBucket: '${vars.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${vars.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${vars.FIREBASE_APP_ID}',
    measurementId: '${vars.FIREBASE_MEASUREMENT_ID}',
  },
  cloudflareWorkerUrl: '${vars.CLOUDFLARE_WORKER_URL}',
};
`;
}

fs.mkdirSync(envDir, { recursive: true });

if (fs.existsSync(prodPath)) {
  console.log('ℹ️ src/environment/environment.ts already exists — keeping it as is');
} else {
  fs.writeFileSync(prodPath, buildEnvTs('PROD'), 'utf-8');
  console.log('✅ Created src/environment/environment.ts');
}

if (fs.existsSync(devPath)) {
  console.log('ℹ️ src/environment/environment.dev.ts already exists — keeping it as is');
} else {
  fs.writeFileSync(devPath, buildEnvTs('DEV'), 'utf-8');
  console.log('✅ Created src/environment/environment.dev.ts');
}