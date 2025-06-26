import { getAccessToken } from './auth';
import { UserApiResponse } from './types';

export interface AccountData {
  First_Name: string;
  Email: string;
  Last_Name: string;
  Display_Name: string;
  ZUID: number;
}

const teamId = 60008432525;

export async function getUserInfo(): Promise<AccountData> {
  const res = await fetch('https://accounts.zoho.in/oauth/user/info', {
    headers: { Authorization: `Zoho-oauthtoken ${await getAccessToken()}` },
  });
  return res.json();
}

export async function getTeamInfo(): Promise<UserApiResponse> {
  const res = await fetch(
    `https://sprintsapi.zoho.in/zsapi/team/${teamId}/users/?action=data&index=1&range=100&type=1`,
    {
      headers: { Authorization: `Zoho-oauthtoken ${await getAccessToken()}` },
    }
  );
  return res.json();
}
