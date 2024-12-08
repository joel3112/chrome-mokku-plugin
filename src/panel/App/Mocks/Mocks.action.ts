import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import { notifications } from '@mantine/notifications';
import { useChromeStore, useChromeStoreState, useGlobalStore } from '@mokku/store';
import { IMockResponse } from '@mokku/types';
import { storeActions } from '../service/storeActions';

const useMockStoreSelector = (state: useChromeStoreState) => ({
  workspaceStore: state.workspaceStore,
  setStoreProperties: state.setStoreProperties,
  setSelectedMock: state.setSelectedMock
});

export const useMockActions = () => {
  const { workspaceStore, setSelectedMock, setStoreProperties } = useChromeStore(
    useMockStoreSelector,
    shallow
  );
  const tab = useGlobalStore((state) => state.meta.tab);

  const getMocksByGroup = useCallback(
    (groupId: string) => {
      return storeActions.getMocksByGroup(workspaceStore, groupId);
    },
    [workspaceStore.mocks]
  );

  const getMockScenarios = useCallback(
    (mock: IMockResponse) => {
      return storeActions.getMockScenarios(workspaceStore, mock);
    },
    [workspaceStore.mocks]
  );

  const isActiveGroupByMock = useCallback(
    (mock: IMockResponse) => {
      return storeActions.isActiveGroupByMock(workspaceStore, mock);
    },
    [workspaceStore.groups]
  );

  const toggleMock = useCallback(
    (mockToBeUpdated: IMockResponse) => {
      const updatedStore = storeActions.updateMocks(workspaceStore, mockToBeUpdated);
      const mockStatus = mockToBeUpdated.active ? 'is enabled' : 'is disabled';
      storeActions
        .updateStoreInDB(updatedStore)
        .then(setStoreProperties)
        .then(() => {
          storeActions.refreshContentStore(tab.id);
          notifications.show({
            title: `"${mockToBeUpdated.name}" is ${mockStatus}`,
            message: `Mock ${mockStatus}`
          });
        })
        .catch(() => {
          notifications.show({
            title: 'Cannot updated mock.',
            message: 'Something went wrong, unable to update mock.',
            color: 'red'
          });
        });
    },
    [workspaceStore, setStoreProperties]
  );
  const deleteMock = useCallback(
    (mockToBeDeleted: IMockResponse) => {
      const updatedStore = storeActions.deleteMocks(workspaceStore, mockToBeDeleted.id);

      storeActions
        .updateStoreInDB(updatedStore)
        .then(setStoreProperties)
        .then(() => {
          storeActions.refreshContentStore(tab.id);
          notifications.show({
            title: `"${mockToBeDeleted.name}" mock deleted`,
            message: `Mock "${mockToBeDeleted.name}" is deleted successfully.`
          });
        })
        .catch((error) => {
          console.log(error);
          notifications.show({
            title: 'Cannot delete mock.',
            message: 'Something went wrong, unable to delete mock. Check console for error.',
            color: 'red'
          });
        });
    },
    [workspaceStore, setStoreProperties]
  );
  const duplicateMock = useCallback(
    (mock: IMockResponse) => {
      setSelectedMock({
        ...mock,
        name: '',
        description: '',
        id: undefined,
        createdOn: undefined,
        selected: false
      });
    },
    [setSelectedMock]
  );

  const editMock = useCallback(
    (mock: IMockResponse) => {
      setSelectedMock(mock);
    },
    [setSelectedMock]
  );

  const selectMockScenario = useCallback(
    (mock: IMockResponse) => {
      const scenarios = getMockScenarios(mock);
      const mocksUpdated = scenarios.map((m) => ({
        ...m,
        selected: m.id === mock.id
      }));

      const updatedStore = storeActions.updateMocks(workspaceStore, mocksUpdated);
      storeActions.updateStoreInDB(updatedStore).then(setStoreProperties);
    },
    [workspaceStore, setStoreProperties]
  );

  return {
    getMocksByGroup,
    getMockScenarios,
    selectMockScenario,
    isActiveGroupByMock,
    toggleMock,
    deleteMock,
    duplicateMock,
    editMock
  };
};
