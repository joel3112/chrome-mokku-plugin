import { v4 as uuidv4 } from 'uuid';
import { defaultTheme, messageService } from '@mokku/services';
import { IDynamicURLMap, IMockGroup, IMockResponse, IStore, IURLMap, MockType } from '@mokku/types';

const getNetworkMethodMap = () => ({
  GET: [],
  POST: [],
  PATCH: [],
  PUT: [],
  DELETE: []
});

const storeName = 'mokku.extension.main.db';

export const getDefaultStore = (): IStore => ({
  theme: defaultTheme,
  active: false,
  settings: {
    enabledScenarios: true
  },
  groups: null,
  mocks: null,
  collections: {}
});

export const getStore = (name = storeName) => {
  return new Promise<{
    store: IStore;
    urlMap: IURLMap;
    dynamicUrlMap: IDynamicURLMap;
  }>((resolve) => {
    chrome.storage.local.get([name], function (result) {
      const store = { ...getDefaultStore(), ...result[name] } as IStore;
      const { urlMap, dynamicUrlMap } = getURLMapWithStore(store);

      resolve({
        store: {
          ...store,
          mocks: store.mocks || [],
          groups: store.groups || []
        },
        urlMap: urlMap,
        dynamicUrlMap
      });
    });
  });
};

export const updateStoreInDB = (store: IStore) => {
  return new Promise<{ store: IStore; urlMap: IURLMap; dynamicUrlMap }>((resolve, reject) => {
    try {
      chrome.storage.local.set({ [storeName]: store }, () => {
        const { dynamicUrlMap, urlMap } = getURLMapWithStore(store);
        resolve({
          store: store as IStore,
          urlMap: urlMap,
          dynamicUrlMap: dynamicUrlMap
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const resetStoreInDB = () => {
  const store = {
    ...getDefaultStore(),
    mocks: [],
    groups: []
  };
  return updateStoreInDB(store);
};

export const getURLMapWithStore = (store: IStore) => {
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

  Object.keys(store.collections).forEach((collection) => {
    const mocks = store.collections[collection].mocks;
    mocks.forEach((mock, index) => {
      if (!urlMap[mock.url]) {
        urlMap[mock.url] = getNetworkMethodMap();
      }

      if (urlMap[mock.url]) {
        urlMap[mock.url][mock.method].push(`${collection}.mocks[${index}]`);
      }
    });
  });

  return { urlMap, dynamicUrlMap, store };
};

export const getMocksByGroup = (store: IStore, groupId: string) => {
  return store.mocks.filter((mock) => mock.groupId === groupId);
};

export const getMockScenarios = (store: IStore, mock: IMockResponse) => {
  const scenarios = store.mocks.filter(
    (m) => m.groupId === mock.groupId && m.method === mock.method && m.url === mock.url
  );

  return scenarios;
};

export const hasMultipleScenarios = (store: IStore, mock: IMockResponse) => {
  return getMockScenarios(store, mock).length > 1;
};

export const isActiveGroupByMock = (store: IStore, mock: IMockResponse) => {
  if (!mock.groupId) {
    return true;
  }

  return store.groups.find((group) => group.id === mock.groupId)?.active;
};

export const addGroups = (oldStore: IStore, dirtyNewGroup: IMockGroup | IMockGroup[]) => {
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

export const duplicateGroup = (
  oldStore: IStore,
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

export const updateGroups = (
  oldStore: IStore,
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

export const deleteGroups = (draftStore: IStore, dirtyGroupId: string | string[]) => {
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

export const addMocks = (oldStore: IStore, dirtyNewMock: IMockResponse | IMockResponse[]) => {
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

export const updateMocks = (
  oldStore: IStore,
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

export const deleteMocks = (draftStore: IStore, dirtyMockId: string | string[]) => {
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

export const refreshContentStore = (tabId?: number) => {
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
  resetStoreInDB,
  getStore,
  getDefaultStore,
  refreshContentStore
};
