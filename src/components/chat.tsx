'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

const Chat = ({
  userName,
  userId,
}: {
  userName: string | undefined;
  userId: string | undefined;
}) => {
  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });
  };

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
      <div className='flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 relative'>
        <div
          key='overview'
          className='max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center'
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.5 }}
            className='text-2xl font-semibold'
          >
            Hello {userName} ({userId})
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.6 }}
            className='text-2xl text-zinc-500'
          >
            How can I help you today?
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Chat;
