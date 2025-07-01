'use client';

import React from 'react';
import { Button } from './ui/button';
import { useChat } from '@ai-sdk/react';
import { toast } from 'sonner';
import { fetchWithErrorHandlers } from '@/lib/utils';
import { ChatSDKError } from '@/lib/errors';
import { FormInput } from './form-input';
import { Messages } from './messages';
import { useRouter } from 'next/navigation';
import { SprintAPIResponse, UserApiResponse } from '@/lib/types';

const Chat = ({
  userName,
  userId,
  teams,
  currentSprint,
}: {
  userName: string | undefined;
  userId: string | undefined;
  teams: UserApiResponse | undefined;
  currentSprint: SprintAPIResponse | undefined;
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });
    router.refresh();
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
    body: {
      userId,
      teams,
      currentSprint,
    },
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
        <h3 className='text-2xl cursor-pointer'>SprintBot</h3>
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
