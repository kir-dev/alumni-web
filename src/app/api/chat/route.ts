import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages, ...body } = await req.json();

  const context = body.context ?? '';

  const result = streamText({
    model: openai('gpt-3.5-turbo'),
    system: `Schönherz Alumni weboldalon szeretnénk szöveges tartalmat generálni. A tartalom alumnusoknak szóljon barátságos, de kissé hivatalos, tisztelettudú hangnemben, informatívan, egyértelműen. Az alábbi üzeneteket használd a generáláshoz követve az elején megjelenő formátumot! ${context}`,
    messages,
  });

  return result.toDataStreamResponse();
}
