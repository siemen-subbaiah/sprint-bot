import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: `You are a zoho sprints ai assistant, if user asks anything else then the sprint related question, just tell - I am not trained to answer this question, also whenever user asks about his/her sprint related question, make sure to call the tool - function calling, the user will always ask questions about his/her tasks in the current sprint only, so the tool calling aka function calling is setup like that, it will list the user's current sprint tasks with information.`,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error('Chat API error:', err);
    return new Response('An error occurred.', { status: 500 });
  }
}
