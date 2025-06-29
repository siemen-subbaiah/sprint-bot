import React, { memo, useCallback, useEffect, useRef } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { Button } from './ui/button';
import { ArrowUpIcon } from 'lucide-react';
import { Textarea } from './ui/textarea';
import cx from 'classnames';
import { toast } from 'sonner';
import { useWindowSize } from 'usehooks-ts';
import { SuggestedActions } from './suggested-actions';
import type { UseChatHelpers } from '@ai-sdk/react';
import type { UIMessage } from 'ai';

const PureFormInput = ({
  input,
  setInput,
  status,
  stop,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
}: {
  input: UseChatHelpers['input'];
  setInput: UseChatHelpers['setInput'];
  status: UseChatHelpers['status'];
  stop: () => void;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers['setMessages'];
  append: UseChatHelpers['append'];
  handleSubmit: UseChatHelpers['handleSubmit'];
  className?: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  // const { isAtBottom, scrollToBottom } = useScrollToBottom();

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '98px';
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const submitForm = useCallback(() => {
    console.log('helo');
    handleSubmit();

    resetHeight();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [width]);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      setInput(domValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form className='flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl'>
      <div className='relative w-full flex flex-col gap-4'>
        {/* <AnimatePresence>
          {!isAtBottom && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className='absolute left-1/2 bottom-28 -translate-x-1/2 z-50'
            >
              <Button
                data-testid='scroll-to-bottom-button'
                className='rounded-full'
                size='icon'
                variant='outline'
                onClick={(event) => {
                  event.preventDefault();
                  scrollToBottom();
                }}
              >
                <ArrowDown />
              </Button>
            </motion.div>
          )}
        </AnimatePresence> */}

        {messages.length === 0 && <SuggestedActions append={append} />}

        <Textarea
          data-testid='multimodal-input'
          ref={textareaRef}
          placeholder='Send a message...'
          value={input}
          onChange={handleInput}
          className={cx(
            'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700',
            className
          )}
          rows={2}
          autoFocus
          onKeyDown={(event) => {
            if (
              event.key === 'Enter' &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();

              if (status !== 'ready') {
                toast.error(
                  'Please wait for the model to finish its response!'
                );
              } else {
                submitForm();
              }
            }
          }}
        />

        <div className='absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end'>
          {status === 'submitted' ? (
            <StopButton stop={stop} setMessages={setMessages} />
          ) : (
            <SendButton input={input} submitForm={submitForm} />
          )}
        </div>
      </div>
    </form>
  );
};

export const FormInput = memo(PureFormInput, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;
  if (prevProps.status !== nextProps.status) return false;
  return true;
});

function PureSendButton({
  submitForm,
  input,
}: {
  submitForm: () => void;
  input: string;
}) {
  return (
    <Button
      data-testid='send-button'
      className='rounded-full p-1.5 h-fit border dark:border-zinc-600'
      onClick={(event) => {
        event.preventDefault();
        submitForm();
      }}
      disabled={input.length === 0}
    >
      <ArrowUpIcon size={14} />
    </Button>
  );
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;
  return true;
});

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void;
  setMessages: UseChatHelpers['setMessages'];
}) {
  return (
    <Button
      data-testid='stop-button'
      className='rounded-full p-1.5 h-fit border dark:border-zinc-600'
      onClick={(event) => {
        event.preventDefault();
        stop();
        setMessages((messages) => messages);
      }}
    >
      <StopIcon size={14} />
    </Button>
  );
}

const StopButton = memo(PureStopButton);

const StopIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      viewBox='0 0 16 16'
      width={size}
      style={{ color: 'currentcolor' }}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3 3H13V13H3V3Z'
        fill='currentColor'
      />
    </svg>
  );
};
