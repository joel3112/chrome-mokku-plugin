export enum MethodEnum {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export enum MockType {
  GROUP = 'group',
  MOCK = 'mock'
}

export enum MockStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum GroupStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum ActionInFormEnum {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  DUPLICATE = 'DUPLICATE'
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
  description?: string;
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
  name: string;
  id: string;
  groupId?: string;
  dynamic?: boolean;
  active: boolean;
  selected: boolean;
  description?: string;
  action?: (req: {
    body: Record<string, any>;
    params: Record<string, any>;
    queryParams: Record<string, any>;
  }) => IMockResponse['response'];
}

export interface IWorkspace {
  id: string;
  name: string;
  active: boolean;
}

export interface IStore {
  active: boolean;
  theme: 'dark' | 'light';
  enabledScenarios: boolean;
  enabledMockConsoleLog: boolean;
  workspaces: Record<string, IWorkspace>;
}

export type IMockResponseRaw = Partial<IMockResponse>;

export interface IWorkspaceStore {
  groups: IMockGroup[];
  mocks: IMockResponse[];
}

export type DBNameType = 'mokku.extension.main.db';

export type IDB = Record<DBNameType, IWorkspaceStore>;

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
