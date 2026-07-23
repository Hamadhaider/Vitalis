// Uses Google's Gemini API (free tier, no
credit card) via a plain fetch call —
// no extra SDK needed. Get a free key at
https://aistudio.google.com/app/apikey
const GEMINI_MODEL = 'gemini-2.5-flash';
// Asks Gemini to respond with strict JSON
and safely parses it.
export async function askForJSON({ system,
userPrompt, maxTokens = 1000 }) {
const apiKey =
process.env.GEMINI_API_KEY;
if (!apiKey) {
throw new Error('GEMINI_API_KEY is not
set on the server.');
}
const url =
`https://generativelanguage.googleapis.com/
v1beta/models/${GEMINI_MODEL}:generateConte
nt?key=${apiKey}`;
const res = await fetch(url, {
method: 'POST',
headers: { 'Content-Type':
'application/json' },
body: JSON.stringify({
system_instruction: { parts: [{ text:
system }] },
contents: [{ role: 'user', parts: [{

text: userPrompt }] }],
generationConfig: {
maxOutputTokens: maxTokens,
responseMimeType:
'application/json',
},
}),
});
if (!res.ok) {
const errText = await res.text();
throw new Error(`Gemini API error:
${errText}`);
}
const data = await res.json();
const raw = data?.candidates?.
[0]?.content?.parts?.[0]?.text || '{}';
try {
return JSON.parse(raw);
} catch (err) {
throw new Error('Vitalis could not
parse the AI response. Please try again.');
}
} 
