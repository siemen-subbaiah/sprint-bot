'use client';

import type { UIMessage } from 'ai';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';
import equal from 'fast-deep-equal';
import { cn, sanitizeText } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { CopyIcon } from 'lucide-react';
import { useCopyToClipboard } from 'usehooks-ts';
import { Markdown } from './markdow';

const PurePreviewMessage = ({
  message,
  requiresScrollPadding,
}: {
  message: UIMessage;
  requiresScrollPadding: boolean;
}) => {
  const [, copyToClipboard] = useCopyToClipboard();

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className='w-full mx-auto max-w-3xl px-4 group/message'
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            'flex gap-4 w-full',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          {message.role === 'assistant' && (
            <div className='size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background'>
              <div className='translate-y-px'>
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div
            className={cn(
              'flex flex-col gap-4',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground px-3 py-2 rounded-xl max-w-2xl'
                : 'w-full',
              message.role === 'assistant' && requiresScrollPadding ? 'min-h-96' : ''
            )}
          >
            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === 'text') {
                return (
                  <div key={key} className='flex flex-row gap-2 items-start'>
                    <div data-testid='message-content'>
                      <Markdown>{sanitizeText(part.text)}</Markdown>
                    </div>
                  </div>
                );
              }
            })}

            {message.role !== 'user' && (
              <TooltipProvider delayDuration={0}>
                <div className='flex flex-row gap-2'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className='py-1 px-2 h-fit text-muted-foreground'
                        variant='outline'
                        onClick={async () => {
                          const textFromParts = message.parts
                            ?.filter((part) => part.type === 'text')
                            .map((part) => part.text)
                            .join('\n')
                            .trim();

                          if (!textFromParts) {
                            toast.error("There's no text to copy!");
                            return;
                          }

                          await copyToClipboard(textFromParts);
                          toast.success('Copied to clipboard!');
                        }}
                      >
                        <CopyIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

    return true;
  }
);

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      data-testid='message-assistant-loading'
      className='w-full mx-auto max-w-3xl px-4 group/message min-h-96'
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true,
          }
        )}
      >
        <div className='size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border'>
          <SparklesIcon size={14} />
        </div>

        <div className='flex flex-col gap-2 w-full'>
          <div className='flex flex-col gap-4 text-muted-foreground'>
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const SparklesIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin='round'
    viewBox='0 0 16 16'
    width={size}
    style={{ color: 'currentcolor' }}
  >
    <path
      d='M2.5 0.5V0H3.5V0.5C3.5 1.60457 4.39543 2.5 5.5 2.5H6V3V3.5H5.5C4.39543 3.5 3.5 4.39543 3.5 5.5V6H3H2.5V5.5C2.5 4.39543 1.60457 3.5 0.5 3.5H0V3V2.5H0.5C1.60457 2.5 2.5 1.60457 2.5 0.5Z'
      fill='currentColor'
    />
    <path
      d='M14.5 4.5V5H13.5V4.5C13.5 3.94772 13.0523 3.5 12.5 3.5H12V3V2.5H12.5C13.0523 2.5 13.5 2.05228 13.5 1.5V1H14H14.5V1.5C14.5 2.05228 14.9477 2.5 15.5 2.5H16V3V3.5H15.5C14.9477 3.5 14.5 3.94772 14.5 4.5Z'
      fill='currentColor'
    />
    <path
      d='M8.40706 4.92939L8.5 4H9.5L9.59294 4.92939C9.82973 7.29734 11.7027 9.17027 14.0706 9.40706L15 9.5V10.5L14.0706 10.5929C11.7027 10.8297 9.82973 12.7027 9.59294 15.0706L9.5 16H8.5L8.40706 15.0706C8.17027 12.7027 6.29734 10.8297 3.92939 10.5929L3 10.5V9.5L3.92939 9.40706C6.29734 9.17027 8.17027 7.29734 8.40706 4.92939Z'
      fill='currentColor'
    />
  </svg>
);
