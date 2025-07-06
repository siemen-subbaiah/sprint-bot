import {
  findUserByNameMatch,
  formatItems,
  listCleanUsers,
} from '@/lib/helpers';
import { getTeamInfo, listSprintTasks } from '@/lib/requests';
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
      - When users ask about someone else's tasks (e.g., "What is John working on?", "Show me nimai's tasks"), first use the findUserByName tool to get their user ID
      - Always use the getUserTasks tool when you need current sprint task information
      - When user refers to "my tasks" or doesn't mention a specific person, use the logged-in user's ID directly
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
      maxSteps: 7,
      tools: {
        findUserByName: tool({
          description: `Find a user's ID by their name. Use this when someone asks about another person's tasks.`,
          parameters: z.object({
            name: z
              .string()
              .describe(
                "The name of the user to find (e.g., 'nimai', 'John', 'kirit')"
              ),
          }),
          execute: async ({ name }) => {
            const teams = await getTeamInfo();
            const cleanUserData = listCleanUsers(teams);
            const matchedUser = findUserByNameMatch(cleanUserData, name);

            if (matchedUser) {
              return {
                success: true,
                user: {
                  userId: matchedUser.userId,
                  userName: matchedUser.userName,
                  email: matchedUser.email,
                },
                message: `Found user: ${matchedUser.userName}`,
              };
            } else {
              return {
                success: false,
                message: `No user found with name "${name}". Available users: ${cleanUserData
                  .map((u) => u.userName)
                  .join(', ')}`,
              };
            }
          },
        }),
        getUserTasks: tool({
          description: `Get sprint tasks for a specific user. Use the user ID from findUserByName when available or just use the logged-in user's ID.`,
          parameters: z.object({
            query: z
              .string()
              .describe(
                'What specific information about tasks are you looking for?'
              ),
            targetUserId: z
              .string()
              .optional()
              .describe(
                "The user ID to get tasks for. If not provided, uses the logged-in user's ID."
              ),
          }),
          execute: async ({ query, targetUserId }) => {
            const userMap = new Map<string, string>();

            const userIdToUse = targetUserId || userId;

            const userData = listCleanUsers(teams);
            userData.forEach((user) => {
              userMap.set(user.userId, user.userName);
            });

            const sprintName: string =
              currentSprint.sprintJObj[currentSprint.sprintIds[0]][0];

            const itemData = await listSprintTasks(
              currentSprint.sprintIds[0],
              userIdToUse!
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
      onStepFinish(res) {
        console.log(res.toolCalls);
        console.log(res.toolResults);
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
