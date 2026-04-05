const fetch = require('node-fetch');

(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/youtube/channel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        youtubeChannelId: 'UCeJQX4F1LyYEjCIJqu9ZoWA',
        apiKey: 'AIzaSyBsGZNsD-W2Wsc_YTUng-H8-hEJ6Nr9uVg',
      }),
    });
    const text = await res.text();
    console.log('status', res.status, 'body', text);
  } catch (err) {
    console.error('error', err);
  }
})();