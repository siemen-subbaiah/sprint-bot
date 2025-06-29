import {
  ItemApiResponse,
  ItemPriorityMap,
  ItemProp,
  ItemStatusMap,
  ItemTypeMap,
  SprintAPIResponse,
  sprintDetailsMap,
  UserApiResponse,
  UserMap,
} from './types';

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
  const userData: { userId: string; email: string; userName: string }[] = [];

  for (const [userId, userArr] of Object.entries(zohoBadUserObj.userJObj)) {
    userData.push({ userId, email: userArr[1], userName: userArr[0] });
  }

  userData.forEach((user) => {
    UserMap.set(user.userId, user.userName);
  });

  return userData;
}

export function storeSprintDetails(currentSprint: SprintAPIResponse) {
  sprintDetailsMap.set(
    Object.keys(currentSprint.sprintJObj).toString(),
    Object.values(currentSprint.sprintJObj)[0][0]
  );
}

export function formatItems(itemData: ItemApiResponse) {
  const items = [];
  const keys: ItemProp = itemData.item_prop;

  Object.entries(itemData.itemJObj).forEach(([, value]) => {
    items.push({
      itemId: `IQ-${value[keys.itemNo]}`,
      itemName: value[keys.itemName],
      createdDate: value[keys.createdTime],
      completedDate: value[keys.completedDate],
      createdBy: UserMap.get(String(value[keys.createdBy])),
      itemType: ItemTypeMap.get(String(value[keys.projItemTypeId])),
      projectName: 'IQnext Cloud',
      sprintName: sprintDetailsMap.get(String(value[keys.sprintId])),
      // relaseName:value[keys.rel]
      assignedTo: (value[keys.ownerId] as string[]).map((owner) =>
        UserMap.get(owner)
      ),
      itemStatus: ItemStatusMap.get(String(value[keys.statusId])),
      itemPriority: ItemPriorityMap.get(String(value[keys.projPriorityId])),
      itemPoints: value[keys.points],
    });
  });

  return items;
}
