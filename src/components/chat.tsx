'use client';

import React from 'react';
import { Button } from './ui/button';
import { useChat } from '@ai-sdk/react';
import { toast } from 'sonner';
import { fetchWithErrorHandlers } from '@/lib/utils';
import { ChatSDKError } from '@/lib/errors';
import { FormInput } from './form-input';
import { Messages } from './messages';

const Chat = ({ userName }: { userName: string | undefined }) => {
  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });
  };

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
  } = useChat({
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    fetch: fetchWithErrorHandlers,
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        toast.error(error.message);
      }
    },
  });

  return (
    <>
      <header className='flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2'>
        <Button
          className='bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 hidden md:flex py-1.5 mt-2 px-2 h-fit md:h-[34px] order-4 md:ml-auto'
          onClick={handleLogout}
        >
          Logout
        </Button>
      </header>
      <Messages
        messages={messages}
        setMessages={setMessages}
        status={status}
        userName={userName!}
      />
      <FormInput
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        status={status}
        stop={stop}
        messages={messages}
        setMessages={setMessages}
        append={append}
      />
    </>
  );
};

export default Chat;
