const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

(async () => {
  try {
    // first test internal API
    const res = await fetch('http://localhost:3001/api/stream-predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation: [] }),
    });
    const text = await res.text();
    console.log('internal status', res.status);
    console.log('internal body', text);

    // now call HF directly with same prompt
    const prompt =
      'You are an assistant that asks the user clarifying questions to ultimately ' +
      'recommend a YouTube stream topic they should make. At each step you should ' +
      'either ask another question or, if you have enough information, return a ' +
      'final prediction.\n' +
      'Respond with only valid JSON in the following format:\n' +
      '{\n  "done": <true|false>,\n  "question": "..."  // present only when done is false and you need more info\n  "prediction": "..." // present only when done is true\n}\n' +
      'Do not include any extra text or explanation.\n';
    console.log('prompt:', prompt);
    const hfRes = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 100, temperature: 0.7 },
      }),
    });
    const hfTxt = await hfRes.text();
    console.log('hf status', hfRes.status);
    console.log('hf raw', hfTxt);
  } catch (e) {
    console.error(e);
  }
})();
