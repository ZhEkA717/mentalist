/**
 * Отправка уведомления IndexNow (Яндекс / Bing) после деплоя.
 * Использование: node scripts/submit-indexnow.js
 * Автоматически вызывается из `npm run deploy`.
 */

const HOST = 'alexshishuk.com';
const KEY = '89cfc1f1598f4ef7b897971fd9d7ba80';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP = `https://${HOST}/sitemap.xml`;

async function submit() {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: [SITEMAP],
  };

  console.log('[IndexNow] Отправка уведомления...');
  console.log('[IndexNow] URL:', SITEMAP);

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify(payload),
    });

    if (res.ok || res.status === 202) {
      console.log(`[IndexNow] OK — HTTP ${res.status} (${res.statusText})`);
    } else {
      console.warn(`[IndexNow] Ошибка — HTTP ${res.status} (${res.statusText})`);
      const text = await res.text().catch(() => '');
      if (text) console.warn('[IndexNow]', text);
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('[IndexNow] Сетевая ошибка:', err.message);
    process.exitCode = 1;
  }
}

submit();
