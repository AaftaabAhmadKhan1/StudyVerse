(async () => {
  const fetchModule = await import('node-fetch');
  const fetch = fetchModule.default || fetchModule;
  const key = process.env.HUGGINGFACE_API_KEY;
  console.log('using key', key ? 'present' : 'missing');
  const model = process.argv[2] || 'gpt2';
  const res = await fetch(`https://router.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: 'Hello world' }),
  });
  console.log('status', res.status);
  const text = await res.text();
  console.log('body', text);
})();
