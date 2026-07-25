// Uses Google's Gemini API (free tier, no credit card) via a plain fetch call —
// no extra SDK needed. Get a free key at https://aistudio.google.com/app/apikey
const GEMINI_MODEL = 'gemini-3.5-flash-lite';

// Asks Gemini to respond with strict JSON and safely parses it.
export async function askForJSON({ system, userPrompt, maxTokens = 1000, language = 'en' }) {
  return callGemini({
    system: withLanguage(system, language),
    parts: [{ text: userPrompt }],
    maxTokens,
  });
}

// Same as askForJSON, but also sends an image (skin/eye/tongue photo, a lab
// report page, etc). imageBase64 should be the raw base64 string (no data:
// URL prefix), mimeType e.g. "image/jpeg" or "application/pdf".
export async function askForJSONWithImage({
  system,
  userPrompt,
  imageBase64,
  mimeType,
  maxTokens = 1000,
  language = 'en',
}) {
  return callGemini({
    system: withLanguage(system, language),
    parts: [
      { text: userPrompt },
      { inline_data: { mime_type: mimeType, data: imageBase64 } },
    ],
    maxTokens,
  });
}

function withLanguage(system, language) {
  if (language === 'ur') {
    return `${system}\n\nIMPORTANT: Write every text value in the JSON response in Urdu\n(اردو), using Urdu script. Keep JSON keys and boolean/enum values in English exactly\nas specified, but all human-readable sentences must be in Urdu.`;
  }
  return system;
}

async function callGemini({ system, parts, maxTokens }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set on the server.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error: ${errText}`);
  }

  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error('Vitalis could not parse the AI response. Please try again.');
  }
}

