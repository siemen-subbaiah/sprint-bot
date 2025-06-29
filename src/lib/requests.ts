import { getAccessToken } from './auth';
import { ItemApiResponse, SprintAPIResponse, UserApiResponse } from './types';

export interface AccountData {
  First_Name: string;
  Email: string;
  Last_Name: string;
  Display_Name: string;
  ZUID: number;
}

const teamId = 60008432525;
const projectId = '13939000000022011';

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

export async function getActiveSprint(): Promise<SprintAPIResponse> {
  const res = await fetch(
    `https://sprintsapi.zoho.in/zsapi/team/${teamId}/projects/${projectId}/sprints/?action=data&index=1&range=100&type=%5B2%5D`,
    {
      headers: { Authorization: `Zoho-oauthtoken ${await getAccessToken()}` },
    }
  );
  return res.json();
}

export async function listSprintTasks(
  sprintId: string,
  userId: string
): Promise<ItemApiResponse> {
  const res = await fetch(
    `https://sprints.zoho.in/zsapi/team/${teamId}/projects/${projectId}/sprints/${sprintId}/item/?groupby=11&subitem=false&sortby=12&isascending=true&lanefilter=%7B%22I-owner%22%3A%5B%22${userId.toString()}%22%5D%7D&range=50&action=data&index=1`,
    {
      headers: { Authorization: `Zoho-oauthtoken ${await getAccessToken()}` },
    }
  );
  return res.json();
}
