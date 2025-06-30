import { formatItems } from '@/lib/helpers';
import { listSprintTasks } from '@/lib/requests';
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, sprintId, userId } = await req.json();

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: `
      You are a helpful AI assistant integrated with Zoho Sprints. Your purpose is to assist users by answering questions specifically about their tasks in the current active sprint.

      You must always use the available tool to fetch the user's sprint task details before responding. Do not answer from your own knowledge.

      If the user's query is not related to their tasks in the current sprint, respond with:
      "I am only trained to answer questions related to your current sprint tasks."
      `,
      messages,
      maxSteps: 3,
      tools: {
        getUserTasks: tool({
          description: `Use this tool to fetch the current sprint tasks assigned to the logged-in user. This includes task titles, assigned users, statuses, start/end dates, and priorities.`,
          parameters: z.object({ query: z.string() }),
          execute: async () => {
            const itemData = await listSprintTasks(sprintId, userId!);
            const cleanItemData = formatItems(itemData);
            return cleanItemData;
          },
        }),
      },
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error('Chat API error:', err);
    console.log(err);
    return new Response('An error occurred.', { status: 500 });
  }
}
