import { createWithEqualityFn } from 'zustand/traditional';
import {
  IDynamicURLMap,
  IMockGroup,
  IMockResponse,
  IStore,
  IURLMap,
  IWorkspace,
  IWorkspaceStore
} from '@mokku/types';
import { storeActions } from '../service/storeActions';

export type StoreProperties = {
  store: IStore;
  workspaceStore: IWorkspaceStore;
  urlMap: IURLMap;
  dynamicUrlMap: IDynamicURLMap;
};

export interface useChromeStoreState extends StoreProperties {
  init: () => Promise<StoreProperties>;
  setStoreProperties: (properties: Partial<StoreProperties>) => void;
  selectedWorkspace?: IWorkspace;
  setSelectedWorkspace: (workspace?: IWorkspace) => void;
  selectedGroup?: IMockGroup;
  setSelectedGroup: (group?: Partial<IMockGroup>) => void;
  selectedMock?: IMockResponse;
  setSelectedMock: (mock?: Partial<IMockResponse>) => void;
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useChromeStore = createWithEqualityFn<useChromeStoreState>((set, get) => ({
  store: storeActions.createDefaultStore(),
  workspaceStore: storeActions.createDefaultWorkspaceStore(),
  dynamicUrlMap: {},
  urlMap: {},
  init: async () => {
    const { store, workspaceStore, urlMap, dynamicUrlMap } = await storeActions.getAllStore();
    const state = { store, workspaceStore, urlMap, dynamicUrlMap };
    set(state);
    return state;
  },
  setStoreProperties: ({
    store = get().store,
    workspaceStore = get().workspaceStore,
    urlMap = get().urlMap,
    dynamicUrlMap = get().dynamicUrlMap
  }) => {
    set({ store, workspaceStore, urlMap, dynamicUrlMap });
  },
  selectedWorkspace: undefined,
  setSelectedWorkspace: (workspace?: IWorkspace) => {
    set({ selectedWorkspace: workspace });
  },
  selectedMock: undefined,
  setSelectedMock: (mock?: IMockResponse) => {
    set({ selectedMock: mock });
  },
  selectedGroup: undefined,
  setSelectedGroup: (group?: IMockGroup) => {
    set({ selectedGroup: group });
  }
}));
