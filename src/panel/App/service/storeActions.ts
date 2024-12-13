import { v4 as uuidv4 } from 'uuid';
import { defaultTheme, messageService } from '@mokku/services';
import { StoreProperties } from '@mokku/store';
import {
  IDynamicURLMap,
  IMockGroup,
  IMockResponse,
  IStore,
  IURLMap,
  IWorkspace,
  IWorkspaceStore,
  MockType
} from '@mokku/types';

const getNetworkMethodMap = () => ({
  GET: [],
  POST: [],
  PATCH: [],
  PUT: [],
  DELETE: []
});

const storeName = 'mokku.extension.main.db';
const getWorkspaceStoreName = (workspaceId: string) =>
  `mokku.extension.workspace-${workspaceId}.db`;
export const DEFAULT_WORKSPACE = 'default';

const createDefaultStore = (): IStore => ({
  active: false,
  theme: defaultTheme,
  enabledScenarios: true,
  workspaces: {
    [DEFAULT_WORKSPACE]: {
      id: DEFAULT_WORKSPACE,
      name: 'Default',
      active: true
    }
  }
});

const createDefaultWorkspaceStore = (): IWorkspaceStore => ({
  groups: null,
  mocks: null
});

const getWorskpaceStore = (workspaceId: string) => {
  return new Promise<StoreProperties['workspaceStore']>((resolve) => {
    const workspaceStoreName = getWorkspaceStoreName(workspaceId);

    chrome.storage.local.get([workspaceStoreName], function (result) {
      const _workspaceStore = {
        ...createDefaultWorkspaceStore(),
        ...result[workspaceStoreName]
      } as IWorkspaceStore;

      resolve({
        ..._workspaceStore,
        mocks: _workspaceStore.mocks || [],
        groups: _workspaceStore.groups || []
      });
    });
  });
};

const getAllStore = () => {
  return new Promise<StoreProperties>((resolve) => {
    chrome.storage.local.get([storeName], async function (resultStore) {
      const _store = { ...createDefaultStore(), ...resultStore[storeName] } as IStore;
      const workspaceActiveId = getActiveWorkspace(_store)?.id;

      if (!workspaceActiveId) {
        resolve({
          store: _store,
          workspaceStore: createDefaultWorkspaceStore(),
          urlMap: {},
          dynamicUrlMap: {}
        });
        return;
      }

      const _workspaceStore = await getWorskpaceStore(workspaceActiveId);
      const { urlMap, dynamicUrlMap } = getURLMapWithStore(_workspaceStore);

      resolve({
        store: _store,
        workspaceStore: _workspaceStore,
        urlMap,
        dynamicUrlMap
      });
    });
  });
};

const updateStoreInDB = (store: IStore) => {
  return new Promise<Pick<StoreProperties, 'store'>>((resolve, reject) => {
    try {
      chrome.storage.local.set({ [storeName]: store }, () => {
        resolve({ store });
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateWorkspaceStoreInDB = (workspaceId: string, workspaceStore: IWorkspaceStore) => {
  return new Promise<Omit<StoreProperties, 'store'>>((resolve, reject) => {
    try {
      const workspaceStoreName = getWorkspaceStoreName(workspaceId);
      chrome.storage.local.set({ [workspaceStoreName]: workspaceStore }, () => {
        const { dynamicUrlMap, urlMap } = getURLMapWithStore(workspaceStore);
        resolve({
          workspaceStore,
          urlMap,
          dynamicUrlMap
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteWorkspaceStoreInDB = (workspaceId: string) => {
  return new Promise<Omit<StoreProperties, 'store'>>((resolve, reject) => {
    try {
      const workspaceStoreName = getWorkspaceStoreName(workspaceId);

      chrome.storage.local.remove(workspaceStoreName, () => {
        getWorskpaceStore(DEFAULT_WORKSPACE).then((workspaceStore) => {
          const { dynamicUrlMap, urlMap } = getURLMapWithStore(workspaceStore);
          resolve({
            workspaceStore,
            urlMap,
            dynamicUrlMap
          });
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

const resetWorkspaceStore = (workspaceId: string) => {
  const workspaceStore = {
    ...createDefaultWorkspaceStore(),
    mocks: [],
    groups: []
  };
  return updateWorkspaceStoreInDB(workspaceId, workspaceStore);
};

const getURLMapWithStore = (store: IWorkspaceStore) => {
  const urlMap: IURLMap = {};
  const dynamicUrlMap: IDynamicURLMap = {};

  (store.mocks || []).forEach((mock, index) => {
    if (mock.dynamic) {
      const url = mock.url.replace('://', '-');
      const key = url.replace('*', '').split('/').filter(Boolean).length;

      const matcher: IDynamicURLMap[number][0] = {
        getterKey: `mocks[${index}]`,
        method: mock.method,
        url: url
      };
      if (dynamicUrlMap[key]) {
        dynamicUrlMap[key].push(matcher);
      } else {
        dynamicUrlMap[key] = [matcher];
      }
      return;
    }
    if (!urlMap[mock.url]) {
      urlMap[mock.url] = getNetworkMethodMap();
    }

    if (urlMap[mock.url]) {
      urlMap[mock.url][mock.method].push(`mocks[${index}]`);
    }
  });

  return { urlMap, dynamicUrlMap, store };
};

const getActiveWorkspace = (store: IStore) => {
  return Object.values(store.workspaces).find((workspace) => workspace.active);
};

const addWorkspace = (oldStore: IStore, workspace: Omit<IWorkspace, 'active'>) => {
  const store = { ...oldStore };
  const newWorkspace: IWorkspace = { ...workspace, active: false };
  store.workspaces = { ...store.workspaces, [workspace.id]: newWorkspace };

  return store;
};

const changeNameWorkspace = (oldStore: IStore, workspaceId: string, name: string) => {
  const store = { ...oldStore };
  store.workspaces = {
    ...store.workspaces,
    [workspaceId]: { ...store.workspaces[workspaceId], name }
  };

  return store;
};

const selectWorkspace = (oldStore: IStore, workspaceId: string) => {
  const store = { ...oldStore };
  store.workspaces = Object.keys(store.workspaces).reduce((acc, key) => {
    const workspace = store.workspaces[key];
    acc[key] = { ...workspace, active: workspace.id === workspaceId };
    return acc;
  }, {});

  return store;
};

const deleteWorkspace = (oldStore: IStore, workspaceId: string) => {
  const store = { ...oldStore };
  delete store.workspaces[workspaceId];

  return selectWorkspace({ ...store }, DEFAULT_WORKSPACE);
};

const getMocksByGroup = (store: IWorkspaceStore, groupId: string) => {
  return store.mocks.filter((mock) => mock.groupId === groupId);
};

const getMockScenarios = (store: IWorkspaceStore, mock: IMockResponse) => {
  const scenarios = store.mocks.filter(
    (m) => m.groupId === mock.groupId && m.method === mock.method && m.url === mock.url
  );

  return scenarios;
};

const hasMultipleScenarios = (store: IWorkspaceStore, mock: IMockResponse) => {
  return getMockScenarios(store, mock).length > 1;
};

const isActiveGroupByMock = (store: IWorkspaceStore, mock: IMockResponse) => {
  if (!mock.groupId) {
    return true;
  }

  return store.groups.find((group) => group.id === mock.groupId)?.active;
};

const addGroups = (oldStore: IWorkspaceStore, dirtyNewGroup: IMockGroup | IMockGroup[]) => {
  const store = { ...oldStore };

  // standardize mock
  const newGroups = Array.isArray(dirtyNewGroup) ? dirtyNewGroup : [dirtyNewGroup];

  newGroups.forEach((group) => {
    store.groups = [
      ...store.groups,
      {
        ...group,
        type: MockType.GROUP,
        expanded: false,
        createdOn: new Date().getTime()
      }
    ];
  });

  return store;
};

const duplicateGroup = (
  oldStore: IWorkspaceStore,
  dirtyNewGroup: IMockGroup,
  copiedGroupId: string
) => {
  const store = { ...oldStore };
  const newGroup = dirtyNewGroup;

  store.groups = [
    ...store.groups,
    {
      ...newGroup,
      type: MockType.GROUP,
      expanded: false,
      createdOn: new Date().getTime()
    }
  ];

  const mocksInCopiedGroup = store.mocks.filter((mock) => mock.groupId === copiedGroupId);
  const newMocks = mocksInCopiedGroup.map((mock) => {
    return {
      ...mock,
      id: uuidv4(),
      groupId: newGroup.id ?? ''
    };
  });
  return addMocks(store, newMocks);
};

type PartialGroupWithId = { id: IMockGroup['id'] } & Partial<IMockGroup>;

const updateGroups = (
  oldStore: IWorkspaceStore,
  dirtyNewGroup: PartialGroupWithId | Array<PartialGroupWithId>
) => {
  const store = { ...oldStore };

  // standardize mock
  const newGroups = Array.isArray(dirtyNewGroup) ? dirtyNewGroup : [dirtyNewGroup];

  const newGroupsMap: Record<string, PartialGroupWithId> = {};
  newGroups.forEach((mock) => {
    newGroupsMap[mock.id] = mock;
  });

  const newStoreGroups = store.groups.map((storeGroup) => {
    const groupToBeUpdated = newGroupsMap[storeGroup.id];
    if (groupToBeUpdated) {
      return { ...storeGroup, ...groupToBeUpdated };
    } else {
      return storeGroup;
    }
  });

  store.groups = newStoreGroups;
  return { ...store, groups: newStoreGroups };
};

const deleteGroups = (draftStore: IWorkspaceStore, dirtyGroupId: string | string[]) => {
  const groupIdsSet = Array.isArray(dirtyGroupId) ? new Set(dirtyGroupId) : new Set([dirtyGroupId]);

  const groups = draftStore.groups.filter((group) => {
    if (groupIdsSet.has(group.id)) {
      return false;
    }
    return true;
  });
  const mocks = draftStore.mocks.filter((mock) => {
    if (groupIdsSet.has(mock.groupId)) {
      return false;
    }
    return true;
  });

  const store = {
    ...draftStore,
    groups,
    mocks
  };

  return store;
};

const isDynamicUrl = (pattern: string) => {
  return pattern.includes('*');
};

const addMocks = (oldStore: IWorkspaceStore, dirtyNewMock: IMockResponse | IMockResponse[]) => {
  const store = { ...oldStore };

  // standardize mock
  const newMocks = Array.isArray(dirtyNewMock) ? dirtyNewMock : [dirtyNewMock];

  newMocks.forEach((mock) => {
    const dynamic = isDynamicUrl(mock.url);
    store.mocks = [
      ...store.mocks,
      {
        ...mock,
        dynamic,
        type: MockType.MOCK,
        createdOn: new Date().getTime()
      }
    ];
  });

  return store;
};

type PartialMockWithId = { id: IMockResponse['id'] } & Partial<IMockResponse>;

const updateMocks = (
  oldStore: IWorkspaceStore,
  dirtyNewMock: PartialMockWithId | Array<PartialMockWithId>
) => {
  const store = { ...oldStore };

  // standardize mock
  const newMocks = Array.isArray(dirtyNewMock) ? dirtyNewMock : [dirtyNewMock];

  const newMocksMap: Record<string, PartialMockWithId> = {};
  newMocks.forEach((mock) => {
    newMocksMap[mock.id] = mock;
  });

  const newStoreMocks = store.mocks.map((storeMock) => {
    const mockToBeUpdated = newMocksMap[storeMock.id];
    if (mockToBeUpdated) {
      const dynamic = isDynamicUrl(mockToBeUpdated.url);
      return { ...storeMock, ...mockToBeUpdated, dynamic };
    } else {
      return storeMock;
    }
  });

  store.mocks = newStoreMocks;
  return { ...store, mocks: newStoreMocks };
};

const deleteMocks = (draftStore: IWorkspaceStore, dirtyMockId: string | string[]) => {
  const mockIdsSet = Array.isArray(dirtyMockId) ? new Set(dirtyMockId) : new Set([dirtyMockId]);

  const mocks = draftStore.mocks.filter((mock) => {
    if (mockIdsSet.has(mock.id)) {
      return false;
    }
    return true;
  });

  const store = {
    ...draftStore,
    mocks
  };

  return store;
};

const refreshContentStore = (tabId?: number) => {
  messageService.send(
    {
      message: 'UPDATE_STORE',
      from: 'PANEL',
      to: 'CONTENT',
      type: 'NOTIFICATION'
    },
    tabId
  );
};

export const storeActions = {
  getActiveWorkspace,
  getMockScenarios,
  hasMultipleScenarios,
  getMocksByGroup,
  isActiveGroupByMock,
  addWorkspace,
  selectWorkspace,
  deleteWorkspace,
  changeNameWorkspace,
  deleteGroups,
  updateGroups,
  addGroups,
  duplicateGroup,
  deleteMocks,
  updateMocks,
  addMocks,
  getURLMapWithStore,
  updateStoreInDB,
  updateWorkspaceStoreInDB,
  deleteWorkspaceStoreInDB,
  resetWorkspaceStore,
  createDefaultStore,
  createDefaultWorkspaceStore,
  getAllStore,
  getWorskpaceStore,
  refreshContentStore
};
