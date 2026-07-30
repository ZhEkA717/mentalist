const fs = require('fs');
const path = require('path');

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
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || fileEnv.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || fileEnv.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || fileEnv.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || fileEnv.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || fileEnv.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || fileEnv.FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID || fileEnv.FIREBASE_MEASUREMENT_ID,
  CLOUDFLARE_WORKER_URL: process.env.CLOUDFLARE_WORKER_URL || fileEnv.CLOUDFLARE_WORKER_URL,
};

const envTs = `// Auto-generated from .env — do not edit manually
export const environment = {
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

const outPath = path.resolve(__dirname, '..', 'src', 'environments', 'environment.ts');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, envTs, 'utf-8');

console.log('✅ Generated src/environments/environment.ts');
