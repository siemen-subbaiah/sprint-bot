import Chat from '@/components/chat';
import ZohoLogin from '@/components/zoho-login';
import { isAuthenticated } from '@/lib/auth';
import { listCleanUsers } from '@/lib/helpers';
import {
  AccountData,
  getActiveSprint,
  getTeamInfo,
  getUserInfo,
} from '@/lib/requests';
import { SprintAPIResponse, UserApiResponse } from '@/lib/types';
import React from 'react';

const page = async () => {
  let userDetails: AccountData | undefined;
  let userId: string | undefined;
  let currentSprint: SprintAPIResponse | undefined;
  let teams: UserApiResponse | undefined;
  const authenticated = await isAuthenticated();

  if (authenticated) {
    userDetails = await getUserInfo();
    teams = await getTeamInfo();
    currentSprint = await getActiveSprint();
    const cleanUserData = listCleanUsers(teams);
    userId = cleanUserData.find(
      (user) => user.email === userDetails?.Email
    )?.userId;
  }

  return (
    <>
      <div className='flex flex-col min-w-0 h-dvh bg-background'>
        {!authenticated ? (
          <ZohoLogin />
        ) : (
          <Chat
            userName={userDetails?.Display_Name}
            userId={userId!}
            teams={teams}
            currentSprint={currentSprint}
          />
        )}
      </div>
    </>
  );
};

export default page;
