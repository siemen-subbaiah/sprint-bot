type UserDetailArray = [
  string,
  string,
  boolean,
  string,
  number,
  number,
  string,
  string,
  boolean,
  Record<string, string>,
  number,
  number,
  number,
  string,
  string,
  string,
  number
];

interface UserJObj {
  [id: string]: UserDetailArray;
}

interface UserProp {
  iamUserId: number;
  userStatus: number;
  displayName: number;
  roleId: number;
  emailId: number;
  addedVia: number;
  lastAccessedTime: number;
  licenseType: number;
  mappingEntity: number;
  integrationUserType: number;
  companyId: number;
  hasPerm_viewuserdet: number;
  profileId: number;
  createdTime: number;
  isConfirmed: number;
  userType: number;
  integObj: number;
}

export interface UserApiResponse {
  userJObj: UserJObj;
  next: boolean;
  userIds: string[];
  user_prop: UserProp;
  status: string;
}

type ItemDetailArray = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
  number,
  boolean,
  boolean,
  boolean,
  string,
  number,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  boolean,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string[],
  boolean,
  string,
  string[],
  number,
  string,
  string,
  boolean,
  boolean,
  string,
  string,
  Record<string, string>,
  Record<string, string>,
  Record<string, string>,
  string[],
  number
];

export interface ItemProp {
  endDate: number;
  releaseCount: number;
  isNotesAdded: number;
  itemNo: number;
  ownerId: number;
  leftPosition: number;
  points: number;
  itemBlockId: number;
  itemEpicSeq: number;
  itemName: number;
  isOverDue: number;
  startAfter: number;
  createdTime: number;
  isIntegrated: number;
  rightPosition: number;
  rootItem: number;
  projPriorityId: number;
  immediateParentId: number;
  isParent: number;
  cycleTime: number;
  level: number;
  userGroupCount: number;
  blockedByObj: number;
  directChilds: number;
  completedDate: number;
  commentCount: number;
  sequence: number;
  sprintId: number;
  statusId: number;
  epicId: number;
  parentItem: number;
  projItemTypeId: number;
  startDate: number;
  integList: number;
  hasSubHierarchy: number;
  leadTime: number;
  addedVia: number;
  hasCheckList: number;
  duration: number;
  diffDays: number;
  actualStartDate: number;
  isDocsAdded: number;
  immediateRootId: number;
  blockedOn: number;
  blockedReason: number;
  cardPreviewData: number;
  depth: number;
  itemStatusSeq: number;
  createdBy: number;
  tagCount: number;
  attachmentCount: number;
  isOrphanItem: number;
  voteCount: number;
  completedBy: number;
}

interface PermissionProp {
  fieldPerm_Release: number;
  fieldPerm_ItemType: number;
  fieldPerm_Epic: number;
  hasDeletePermission: number;
  fieldPerm_Title: number;
  fieldPerm_EndDate: number;
  fieldPerm_Sprint: number;
  fieldPerm_UserGroup: number;
  hasCustomFieldPerm: number;
  hasBlockItemEditPermission: number;
  fieldPerm_Points: number;
  fieldPerm_Status: number;
  hasCommentAddPermission: number;
  isSharedWithMe: number;
  fieldPerm_logtimer: number;
  hasViewViaSharing: number;
  hasPIIFieldPerm: number;
  hasChecklistAddPermission: number;
  hasSubItemReorderPerm: number;
  hasSubItemAddPermission: number;
  fieldPerm_Assignee: number;
  fieldPerm_Priority: number;
  fieldPerm_StartDate: number;
  isMyTask: number;
  isUnassigned: number;
  hasClonePermission: number;
  hasEditPermission: number;
  hasTimerPermission: number;
  fieldPerm_Duration: number;
  fieldPerm_Desc: number;
}

interface ItemJObj {
  [id: string]: ItemDetailArray;
}

interface UserDisplayName {
  [id: string]: string;
}

interface ZsUserIdVsZuid {
  [id: string]: string;
}

export interface ItemApiResponse {
  next: boolean;
  item_prop: ItemProp;
  permission_prop: PermissionProp;
  itemIds: string[];
  userDisplayName: UserDisplayName;
  itemJObj: ItemJObj;
  zsuserIdvsZUID: ZsUserIdVsZuid;
  permissionJObj: {
    [id: string]: boolean[];
  };
  status: string;
}

type SprintDetailArray = [
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

interface SprintProp {
  canceledOn: number;
  scrumMaster: number;
  endDate: number;
  canceledBy: number;
  duration: number;
  startAfter: number;
  createdBy: number;
  completedOn: number;
  sprintType: number;
  createdTime: number;
  sprintName: number;
  startDate: number;
  workflowId: number;
  sprintNo: number;
}

interface SprintJObj {
  [id: string]: SprintDetailArray;
}

interface ZsUserIdVsZUID {
  [id: string]: string;
}

export interface SprintAPIResponse {
  next: boolean;
  sprintIds: string[];
  sprint_prop: SprintProp;
  userDisplayName: UserDisplayName;
  sprintJObj: SprintJObj;
  zsuserIdvsZUID: ZsUserIdVsZUID;
  status: string;
}

export interface CleanedItems {
  itemId: string;
  itemName: string;
  createdDate: string;
  completedDate: string;
  createdBy: string;
  itemType: string;
  projectName: string;
  sprintName: string;
  assignedTo: string[];
  itemStatus: string;
  itemPriority: string;
  itemPoints: number;
}

export const ItemStatusMap = new Map([
  ['13939000000003089', 'To do'],
  ['13939000000003091', 'In progress'],
  ['13939000000007745', 'Blocked'],
  ['13939000000149907', 'Testing'],
  ['13939000001294659', 'Code Review'],
  ['13939000000003097', 'Done'],
  ['13939000000462723', 'Rejected'],
]);

export const ItemTypeMap = new Map([
  ['13939000000022053', 'Task'],
  ['13939000000022055', 'Sub Task'],
  ['13939000000022057', 'Story'],
  ['13939000000022059', 'Bug'],
  ['13939000000022061', 'Epic'],
]);

export const ItemPriorityMap = new Map([
  ['13939000000022013', 'Highest'],
  ['13939000000022015', 'High'],
  ['13939000000022017', 'Medium'],
  ['13939000000022019', 'Low'],
  ['13939000000022021', 'Lowest'],
  ['13939000000022023', 'None'],
  ['13939000001109521', 'Un-Clear'],
]);

export const UserMap = new Map<string, string>();

export const sprintDetailsMap = new Map<string, string>();
