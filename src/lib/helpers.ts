import { UserApiResponse } from './types';

let sprintUserId: string;

export function storeUserId(userId: string) {
  sprintUserId = userId;
}

export function retrieveUserId() {
  return sprintUserId;
}

// some helper functions to cleanup zoho's response mess!

export function listCleanUsers(zohoBadUserObj: UserApiResponse) {
  // here zohoBadObj is literally bad,
  const userData: { userId: string; email: string }[] = [];

  for (const [userId, userArr] of Object.entries(zohoBadUserObj.userJObj)) {
    userData.push({ userId, email: userArr[1] });
  }

  return userData;
}
