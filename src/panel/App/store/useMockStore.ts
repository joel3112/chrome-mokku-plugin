import { create } from 'zustand';
import { IDynamicURLMap, IMockGroup, IMockResponse, IStore, IURLMap } from '@mokku/types';
import { storeActions } from '../service/storeActions';

export type StoreProperties = {
  store: IStore;
  urlMap: IURLMap;
  dynamicUrlMap: IDynamicURLMap;
};

export interface useChromeStoreState extends StoreProperties {
  init: () => void;
  setStoreProperties: (properties: StoreProperties) => void;
  selectedGroup?: IMockGroup;
  setSelectedGroup: (group?: Partial<IMockGroup>) => void;
  selectedMock?: IMockResponse;
  setSelectedMock: (mock?: Partial<IMockResponse>) => void;
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useChromeStore = create<useChromeStoreState>((set, get) => ({
  store: storeActions.getDefaultStore(),
  dynamicUrlMap: {},
  urlMap: {},
  init: async () => {
    const { dynamicUrlMap, store, urlMap } = await storeActions.getStore();
    set({ dynamicUrlMap, store, urlMap });
  },
  setStoreProperties: ({ dynamicUrlMap, store, urlMap }) => {
    set({ dynamicUrlMap, store, urlMap });
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
