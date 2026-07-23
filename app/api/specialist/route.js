import { askForJSON } from '@/lib/ai';

const SYSTEM_PROMPT = `You are the routing engine inside Vitalis, a health-navigation app.
Your ONLY job is to suggest which TYPE of medical specialist a person should consider
seeing based on symptoms they describe, and to explain your reasoning briefly.

Hard rules:
- You are not diagnosing a condition. Never name a specific disease as if it is confirmed.
- Never give dosing, prescribing, or treatment instructions.
- If the symptoms described could indicate an emergency (e.g. chest pain, difficulty
  breathing, stroke signs, severe bleeding, suicidal thoughts, anaphylaxis), set
  "emergency" to true and make the recommendation "Emergency / urgent care" regardless
  of other symptoms.
- Always keep language plain, calm, and non-alarmist.
- Base the specialist type on common medical triage conventions (e.g. persistent rash ->
  dermatologist, joint pain with swelling -> rheumatologist, recurring hives/allergic
  reaction -> allergist/immunologist).

Respond with ONLY valid JSON, no prose outside the JSON, in exactly this shape:
{
  "emergency": boolean,
  "specialist": "string - the type of specialist, e.g. Dermatologist",
  "confidence": "low" | "medium" | "high",
  "reasoning": "2-3 sentences explaining why, in plain language",
  "alternativeSpecialist": "string or null - a second reasonable option if genuinely ambiguous",
  "questionsToAsk": ["3 short, specific questions the person could bring to that specialist"],
  "disclaimer": "one short sentence reminding this is not a diagnosis"
}`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { symptoms, duration, severity } = body;

    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length < 3) {
      return Response.json({ error: 'Please describe your symptoms in a bit more detail.' }, { status: 400 });
    }

    const userPrompt = `Symptoms: ${symptoms.trim()}
Duration: ${duration || 'not specified'}
Self-rated severity (1-10): ${severity || 'not specified'}

Return the specialist routing JSON as instructed.`;

    const result = await askForJSON({ system: SYSTEM_PROMPT, userPrompt, maxTokens: 700 });
    return Response.json(result);
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message || 'Something went wrong.' }, { status: 500 });
  }
}
