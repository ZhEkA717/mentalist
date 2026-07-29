const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Send POST request', { status: 405, headers: CORS_HEADERS });
    }

    try {
      const data = await request.json();

      const message =
        `📩 <b>Новая заявка</b>\n\n` +
        `<b>Имя:</b> ${data.name || '—'}\n` +
        `<b>Телефон/Telegram:</b> ${data.phone || '—'}\n` +
        `<b>Дата мероприятия:</b> ${data.eventDate || '—'}\n` +
        `<b>Город:</b> ${data.city || '—'}\n` +
        `<b>Тип мероприятия:</b> ${data.eventType || '—'}\n` +
        (data.comment ? `\n<b>Комментарий:</b> ${data.comment}\n` : '');

      const resp = await fetch(
        `https://api.telegram.org/bot${(env.BOT_TOKEN || '').trim()}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: Number((env.CHAT_ID || '').trim()),
            text: message,
            parse_mode: 'HTML',
          }),
        }
      );

      if (!resp.ok) {
        const err = await resp.text();
        return new Response(`Telegram error: ${err}`, { status: 500, headers: CORS_HEADERS });
      }

      return new Response('OK', { status: 200, headers: CORS_HEADERS });
    } catch (e) {
      return new Response(`Error: ${e.message}`, { status: 500, headers: CORS_HEADERS });
    }
  },
};
