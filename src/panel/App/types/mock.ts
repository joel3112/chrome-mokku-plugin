// export type IMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export enum MethodEnum {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum MockType {
  GROUP = "group",
  MOCK = "mock",
}

export enum MockStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum GroupStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum ActionInFormEnum {
  ADD = "ADD",
  UPDATE = "UPDATE",
  DUPLICATE = "DUPLICATE",
}

export type Headers = Array<{ name: string; value: string }>;

export interface ILog {
  request?: {
    url: string;
    method: MethodEnum;
    body?: string;
    queryParams?: string;
    headers: Headers;
  };
  response?: {
    status: number;
    response: string;
    headers: Headers;
  };
  mockResponse?: IMockResponse;
  id: number | string;
  // if the API response is mocked
  isMocked?: boolean;
  // will be used to fetch mock from store
  mockPath?: string;
}

export interface IMockGroup {
  type: MockType.GROUP;
  name: string;
  description: string;
  id: string;
  active: boolean;
  createdOn: number;
  expanded?: boolean;
}

export type IMockGroupRaw = Partial<IMockGroup>;

export interface IMockResponse {
  type: MockType.MOCK;
  method: MethodEnum;
  createdOn: number;
  url: string;
  status: number;
  response?: string;
  headers?: Headers;
  delay?: number;
  name?: string;
  id: string;
  groupId?: string;
  dynamic?: boolean;
  active: boolean;
  selected: boolean;
  description: string;
  action?: (req: {
    body: Record<string, any>;
    params: Record<string, any>;
    queryParams: Record<string, any>;
  }) => IMockResponse["response"];
}

export type IMockResponseRaw = Partial<IMockResponse>;

export interface IStore {
  active: boolean;
  theme: "dark" | "light";
  settings: {
    enabledScenarios: boolean;
  };
  groups: IMockGroup[];
  totalGroupsCreated: number;
  mocks: IMockResponse[];
  totalMocksCreated: number;
  activityInfo: {
    promoted: boolean;
  };
  collections: Record<
    string,
    {
      groups: IMockGroup[];
      mocks: IMockResponse[];
      id: number;
      active: boolean;
    }
  >;
}

export type DBNameType = "mokku.extension.main.db";

export type IDB = Record<DBNameType, IStore>;

export interface IURLMap {
  [url: string]: {
    [method: string]: string[];
  };
}

export interface IDynamicURLMap {
  [urlLength: number]: Array<{
    method: string;
    getterKey: string;
    url: string;
  }>;
}
