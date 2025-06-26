import Chat from '@/components/chat';
import ZohoLogin from '@/components/zoho-login';
import { isAuthenticated } from '@/lib/auth';
import { listCleanUsers, storeUserId } from '@/lib/helpers';
import { AccountData, getTeamInfo, getUserInfo } from '@/lib/requests';
import React from 'react';

const page = async () => {
  let userDetails: AccountData | undefined;
  let userId: string | undefined;
  const authenticated = await isAuthenticated();

  if (authenticated) {
    userDetails = await getUserInfo();
    const teams = await getTeamInfo();
    const cleanUserData = listCleanUsers(teams);
    userId = cleanUserData.find(
      (user) => user.email === userDetails?.Email
    )?.userId;
    storeUserId(userId!);
  }

  return (
    <>
      <div className='flex flex-col min-w-0 h-dvh bg-background'>
        {!authenticated ? (
          <ZohoLogin />
        ) : (
          <Chat userName={userDetails?.Display_Name} userId={userId} />
        )}
      </div>
    </>
  );
};

export default page;
