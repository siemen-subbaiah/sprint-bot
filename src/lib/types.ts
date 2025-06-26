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
