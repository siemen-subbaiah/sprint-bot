'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import Image from 'next/image';

const ZohoLogin = () => {
  const ZOHO_AUTH_URL = `https://accounts.zoho.in/oauth/v2/auth?scope=aaaserver.profile.READ,
ZohoSprints.teamusers.READ,ZohoSprints.sprints.READ,ZohoSprints.items.READ&client_id=${process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID}&state=testing&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URL}&access_type=offline`;

  return (
    <div className='max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
        className='mb-8 text-center'
      >
        <h1 className='text-3xl font-bold mb-2'>Zoho Sprints AI Chatbot</h1>
        <p className='text-zinc-600 text-lg'>
          Your smart assistant for Zoho Sprints. Sign in to get started!
        </p>
      </motion.div>
      <motion.a
        href={ZOHO_AUTH_URL}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className='cursor-pointer flex justify-center'
      >
        <Button>
          <Image src='/zoho-logo.png' alt='zoho-logo' width={30} height={30} />
          Sign in with Zoho
        </Button>
      </motion.a>
    </div>
  );
};

export default ZohoLogin;
