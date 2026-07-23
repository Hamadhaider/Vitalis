import Anthropic from '@anthropic-ai/sdk';

let client = null;

export function getClient() {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set on the server.');
    }
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

// Asks Claude to respond with strict JSON and safely parses it,
// even if the model wraps the JSON in a code fence.
export async function askForJSON({ system, userPrompt, maxTokens = 1000 }) {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  const raw = textBlock ? textBlock.text : '{}';
  const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error('Vitalis could not parse the AI response. Please try again.');
  }
}
