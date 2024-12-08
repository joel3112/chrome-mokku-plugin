import { v4 as uuidv4 } from 'uuid';
import { defaultTheme, messageService } from '@mokku/services';
import {
  IDynamicURLMap,
  IMockGroup,
  IMockResponse,
  IURLMap,
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

const getDefaultStore = (): IWorkspaceStore => ({
  theme: defaultTheme,
  active: false,
  settings: {
    enabledScenarios: true
  },
  groups: null,
  mocks: null
});

const getStore = (name = storeName) => {
  return new Promise<{
    workspaceStore: IWorkspaceStore;
    urlMap: IURLMap;
    dynamicUrlMap: IDynamicURLMap;
  }>((resolve) => {
    chrome.storage.local.get([name], function (result) {
      const _workspaceStore = { ...getDefaultStore(), ...result[name] } as IWorkspaceStore;
      const { urlMap, dynamicUrlMap } = getURLMapWithStore(_workspaceStore);

      resolve({
        workspaceStore: {
          ..._workspaceStore,
          mocks: _workspaceStore.mocks || [],
          groups: _workspaceStore.groups || []
        },
        urlMap: urlMap,
        dynamicUrlMap
      });
    });
  });
};

const updateStoreInDB = (workspaceStore: IWorkspaceStore) => {
  return new Promise<{ workspaceStore: IWorkspaceStore; urlMap: IURLMap; dynamicUrlMap }>(
    (resolve, reject) => {
      try {
        chrome.storage.local.set({ [storeName]: workspaceStore }, () => {
          const { dynamicUrlMap, urlMap } = getURLMapWithStore(workspaceStore);
          resolve({
            workspaceStore: workspaceStore as IWorkspaceStore,
            urlMap: urlMap,
            dynamicUrlMap: dynamicUrlMap
          });
        });
      } catch (error) {
        reject(error);
      }
    }
  );
};

const resetStore = (resetStore?: IWorkspaceStore) => {
  const store = resetStore || {
    ...getDefaultStore(),
    mocks: [],
    groups: []
  };
  return updateStoreInDB(store);
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
  getMockScenarios,
  hasMultipleScenarios,
  getMocksByGroup,
  isActiveGroupByMock,
  deleteGroups,
  updateGroups,
  addGroups,
  duplicateGroup,
  deleteMocks,
  updateMocks,
  addMocks,
  getURLMapWithStore,
  updateStoreInDB,
  resetStore,
  getStore,
  getDefaultStore,
  refreshContentStore
};
