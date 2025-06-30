'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo } from 'react';
import type { UseChatHelpers } from '@ai-sdk/react';

interface SuggestedActionsProps {
  append: UseChatHelpers['append'];
}

function PureSuggestedActions({ append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'What are the tasks',
      label: 'assigned to me in this sprint?',
      action: 'What are the tasks assigned to me in this sprint?',
    },
    {
      title: 'Which tasks are',
      label: 'currently in code review?',
      action: 'Which tasks are currently in code review?',
    },
    {
      title: 'List all',
      label: 'high priority tasks I have',
      action: 'List all high priority tasks I have',
    },
    {
      title: 'What are my',
      label: 'pending tasks for this sprint?',
      action: 'What are my pending tasks for this sprint?',
    },
  ];

  return (
    <div
      data-testid='suggested-actions'
      className='grid sm:grid-cols-2 gap-2 w-full'
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant='ghost'
            onClick={async () => {
              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className='text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start'
          >
            <span className='font-medium'>{suggestedAction.title}</span>
            <span className='text-muted-foreground'>
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions);
