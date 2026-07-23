import { askForJSON } from '@/lib/ai';

const SYSTEM_PROMPT = `You are the pattern-recognition engine inside Vitalis, a health
-navigation app's daily condition logger. You are given a list of dated log entries for
ONE chronic condition (symptom notes, severity 1-10, and selected possible triggers).

Hard rules:
- Only describe patterns actually present in the data given (e.g. "severity was higher
  on days you logged poor sleep"). Do not invent a trend if there isn't enough data —
  say so plainly if entries are too few (fewer than 4) to find a pattern.
- Never diagnose, never suggest medication or dosing changes.
- Keep it encouraging and specific, not generic wellness advice.

Respond with ONLY valid JSON, no prose outside the JSON, in exactly this shape:
{
  "hasEnoughData": boolean,
  "summary": "2-4 sentences describing what the data shows",
  "possibleTriggers": ["trigger patterns actually observed in the data, or empty array"],
  "suggestion": "one practical, non-medical suggestion (e.g. what to keep tracking), or null",
  "disclaimer": "one short sentence noting this is a pattern observation, not medical advice"
}`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { condition, entries } = body;

    if (!Array.isArray(entries) || entries.length === 0) {
      return Response.json({ error: 'Log at least one entry first.' }, { status: 400 });
    }

    const formatted = entries
      .map(
        (e) =>
          `Date: ${e.date} | Severity: ${e.severity}/10 | Triggers: ${
            (e.triggers || []).join(', ') || 'none noted'
          } | Notes: ${e.notes || 'none'}`
      )
      .join('\n');

    const userPrompt = `Condition being tracked: ${condition || 'unspecified'}\n\nLog entries:\n${formatted}\n\nReturn the pattern-insight JSON as instructed.`;

    const result = await askForJSON({ system: SYSTEM_PROMPT, userPrompt, maxTokens: 700 });
    return Response.json(result);
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message || 'Something went wrong.' }, { status: 500 });
  }
}
