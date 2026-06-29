// D:\ARJUN_code\pr-intel\scrape.mjs
const res = await fetch('http://localhost:5000/api/knowledge/scrape-docs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
});
const text = await res.text();
console.log(text);