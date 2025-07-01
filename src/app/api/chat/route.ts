import { formatItems, listCleanUsers } from '@/lib/helpers';
import { listSprintTasks } from '@/lib/requests';
import { SprintAPIResponse, UserApiResponse } from '@/lib/types';
import { openai } from '@ai-sdk/openai';
import { CoreMessage, streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const {
      messages,
      userId,
      teams,
      currentSprint,
    }: {
      messages: CoreMessage[];
      userId: string;
      teams: UserApiResponse;
      currentSprint: SprintAPIResponse;
    } = await req.json();

    // Extract previous tool results from conversation history to maintain context
    const previousTaskData = extractTaskDataFromMessages(messages);

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: `
      You are a helpful AI assistant integrated with Zoho Sprints. Your purpose is to assist users by answering questions specifically about their tasks in the current active sprint.
      
      IMPORTANT CONTEXT RULES:
      - Always use the getUserTasks tool when you need current sprint task information
      - Remember and reference tasks discussed earlier in this conversation
      - When user refers to "this task", "that one", or "it", look for the most recently mentioned task in our conversation
      - Maintain context about previously discussed tasks, their statuses, priorities, and details
      - If you've already fetched tasks in this conversation, you can reference them without re-fetching unless the user asks for updated information
      
      CONVERSATION STYLE:
      - Be conversational and remember what we've discussed
      - Reference previous parts of our conversation naturally
      - Ask follow-up questions to better understand user needs
      - Provide actionable insights about their tasks
      
      If the user's query is not related to their tasks in the current sprint, respond with:
      "I can only help with questions about your current sprint tasks. What would you like to know about your tasks?"
      
      ${
        previousTaskData
          ? `\nPREVIOUSLY DISCUSSED TASKS:\n${previousTaskData}`
          : ''
      }
      `,
      messages,
      maxSteps: 5, // Increased for better conversation flow
      tools: {
        getUserTasks: tool({
          description: `Fetch current sprint tasks for the user. Use when you need fresh task data or when starting a new topic about tasks.`,
          parameters: z.object({
            query: z
              .string()
              .describe(
                'What specific information about tasks are you looking for?'
              ),
          }),
          execute: async ({ query }) => {
            const userMap = new Map<string, string>();

            const userData = listCleanUsers(teams);
            userData.forEach((user) => {
              userMap.set(user.userId, user.userName);
            });

            const sprintName: string =
              currentSprint.sprintJObj[currentSprint.sprintIds[0]][0];

            const itemData = await listSprintTasks(
              currentSprint.sprintIds[0],
              userId!
            );
            const cleanItemData = formatItems(itemData, userMap, sprintName);

            // Add timestamp to help with context
            return {
              ...cleanItemData,
              fetchedAt: new Date().toISOString(),
              queryContext: query,
            };
          },
        }),
      },
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error('Chat API error:', err);
    return new Response('An error occurred while processing your request.', {
      status: 500,
    });
  }
}

// Helper function to extract task context from previous messages
function extractTaskDataFromMessages(messages: CoreMessage[]) {
  let taskContext = '';

  // Look for assistant messages that contain task information
  for (const message of messages) {
    if (message.role === 'assistant' && message.content) {
      let contentText = '';
      if (typeof message.content === 'string') {
        contentText = message.content;
      }
      // Extract task names, IDs, or statuses mentioned
      const taskMentions = contentText.match(
        /task\s+["']([^"']+)["']|task\s+(\w+)/gi
      );
      if (taskMentions) {
        taskContext += `Previously discussed: ${taskMentions.join(', ')}\n`;
      }
    }
  }

  return taskContext;
}
