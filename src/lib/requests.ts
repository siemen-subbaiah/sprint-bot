import { getAccessToken } from './auth';
import { ItemApiResponse, SprintAPIResponse, UserApiResponse } from './types';

export interface AccountData {
  First_Name: string;
  Email: string;
  Last_Name: string;
  Display_Name: string;
  ZUID: number;
}

export async function getUserInfo(): Promise<AccountData> {
  const res = await fetch('https://accounts.zoho.in/oauth/user/info', {
    headers: { Authorization: `Zoho-oauthtoken ${await getAccessToken()}` },
  });
  return res.json();
}

export async function getTeamInfo(): Promise<UserApiResponse> {
  const res = await fetch(
    `https://sprintsapi.zoho.in/zsapi/team/${process.env.ZOHO_SPRINT_TEAM_ID}/users/?action=data&index=1&range=100&type=1`,
    {
      headers: { Authorization: `Zoho-oauthtoken ${await getAccessToken()}` },
    }
  );
  return res.json();
}

export async function getActiveSprint(): Promise<SprintAPIResponse> {
  const res = await fetch(
    `https://sprintsapi.zoho.in/zsapi/team/${process.env.ZOHO_SPRINT_TEAM_ID}/projects/${process.env.ZOHO_SPRINT_PROJECT_ID}/sprints/?action=data&index=1&range=100&type=%5B2%5D`,
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
    `https://sprints.zoho.in/zsapi/team/${
      process.env.ZOHO_SPRINT_TEAM_ID
    }/projects/${
      process.env.ZOHO_SPRINT_PROJECT_ID
    }/sprints/${sprintId}/item/?groupby=11&subitem=false&sortby=12&isascending=true&lanefilter=%7B%22I-owner%22%3A%5B%22${userId.toString()}%22%5D%7D&range=50&action=data&index=1`,
    {
      headers: { Authorization: `Zoho-oauthtoken ${await getAccessToken()}` },
    }
  );
  return res.json();
}
