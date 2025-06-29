import Chat from '@/components/chat';
import ZohoLogin from '@/components/zoho-login';
import { isAuthenticated } from '@/lib/auth';
import {
  formatItems,
  listCleanUsers,
  storeSprintDetails,
  storeUserId,
} from '@/lib/helpers';
import {
  AccountData,
  getActiveSprint,
  getTeamInfo,
  getUserInfo,
  listSprintTasks,
} from '@/lib/requests';
import React from 'react';

const page = async () => {
  let userDetails: AccountData | undefined;
  let userId: string | undefined;
  const authenticated = await isAuthenticated();

  if (authenticated) {
    userDetails = await getUserInfo();
    const teams = await getTeamInfo();
    const currentSprint = await getActiveSprint();
    storeSprintDetails(currentSprint);
    const cleanUserData = listCleanUsers(teams);
    userId = cleanUserData.find(
      (user) => user.email === userDetails?.Email
    )?.userId;
    storeUserId(userId!);
    const itemData = await listSprintTasks(currentSprint.sprintIds[0], userId!);
    const cleanItemData = formatItems(itemData);
    console.log(cleanItemData);
  }

  return (
    <>
      <div className='flex flex-col min-w-0 h-dvh bg-background'>
        {!authenticated ? (
          <ZohoLogin />
        ) : (
          <Chat userName={userDetails?.Display_Name} />
        )}
      </div>
    </>
  );
};

export default page;
