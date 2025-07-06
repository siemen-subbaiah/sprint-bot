import {
  CleanedItems,
  ItemApiResponse,
  ItemPriorityMap,
  ItemProp,
  ItemStatusMap,
  ItemTypeMap,
  UserApiResponse,
} from './types';

// some helper functions to cleanup zoho's response mess!

export function listCleanUsers(zohoBadUserObj: UserApiResponse) {
  // here zohoBadObj is literally bad,
  const userData: { userId: string; email: string; userName: string }[] = [];

  for (const [userId, userArr] of Object.entries(zohoBadUserObj.userJObj)) {
    userData.push({ userId, email: userArr[1], userName: userArr[0] });
  }

  return userData;
}

export function findUserByNameMatch(
  users: { userId: string; email: string; userName: string }[],
  name: string
) {
  const normalizedSearch = name.toLowerCase().trim();

  // Try exact match first
  let match = users.find(
    (user) =>
      user.userName.toLowerCase() === normalizedSearch ||
      user.email.toLowerCase() === normalizedSearch
  );

  if (match) return match;

  match = users.find(
    (user) =>
      user.userName.toLowerCase().includes(normalizedSearch) ||
      normalizedSearch.includes(user.userName.toLowerCase())
  );

  if (match) return match;
}

export function formatItems(
  itemData: ItemApiResponse,
  userMap: Map<string, string>,
  sprintName: string
) {
  const items: CleanedItems[] = [];
  const keys: ItemProp = itemData.item_prop;

  Object.entries(itemData.itemJObj).forEach(([, value]) => {
    items.push({
      itemId: `IQ-${value[keys.itemNo]}`,
      itemName: value[keys.itemName],
      createdDate: value[keys.createdTime],
      completedDate: value[keys.completedDate],
      createdBy: userMap.get(String(value[keys.createdBy])),
      itemType: ItemTypeMap.get(String(value[keys.projItemTypeId])),
      projectName: 'IQnext Cloud',
      sprintName,
      // relaseName:value[keys.rel]
      assignedTo: (value[keys.ownerId] as string[]).map((owner) =>
        userMap.get(owner)
      ),
      itemStatus: ItemStatusMap.get(String(value[keys.statusId])),
      itemPriority: ItemPriorityMap.get(String(value[keys.projPriorityId])),
      itemPoints: value[keys.points],
    });
  });

  return items;
}
