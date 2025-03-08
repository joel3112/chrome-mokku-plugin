import * as React from 'react';
import { shallow } from 'zustand/shallow';
import { Space, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useChromeStore, useChromeStoreState, useGlobalStore } from '@mokku/store';
import { IMockResponse } from '@mokku/types';
import { storeActions } from '../service/storeActions';

const useMockStoreSelector = (state: useChromeStoreState) => ({
  workspaceStore: state.workspaceStore,
  setStoreProperties: state.setStoreProperties,
  selectedWorkspace: state.selectedWorkspace,
  setSelectedMock: state.setSelectedMock
});

export const useMockActions = () => {
  const tab = useGlobalStore((state) => state.meta.tab);
  const { workspaceStore, selectedWorkspace, setSelectedMock, setStoreProperties } = useChromeStore(
    useMockStoreSelector,
    shallow
  );

  const getMocksByGroup = (groupId: string) => {
    return storeActions.getMocksByGroup(workspaceStore, groupId);
  };

  const getMockScenarios = (mock: IMockResponse) => {
    return storeActions.getMockScenarios(workspaceStore, mock);
  };

  const isActiveGroupByMock = (mock: IMockResponse) => {
    return storeActions.isActiveGroupByMock(workspaceStore, mock);
  };

  const toggleMock = (mockToBeUpdated: IMockResponse) => {
    const updatedWorkspaceStore = storeActions.updateMocks(workspaceStore, mockToBeUpdated);
    const mockStatus = mockToBeUpdated.active ? 'is enabled' : 'is disabled';

    storeActions
      .updateWorkspaceStoreInDB(selectedWorkspace.id, updatedWorkspaceStore)
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
  };

  const deleteMock = (mockToBeDeleted: IMockResponse) => {
    const updatedWorkspaceStore = storeActions.deleteMocks(workspaceStore, mockToBeDeleted.id);

    storeActions
      .updateWorkspaceStoreInDB(selectedWorkspace.id, updatedWorkspaceStore)
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
  };

  const deleteMockScenarios = (mockToBeDeleted: IMockResponse) => {
    const scenarios = getMockScenarios(mockToBeDeleted);

    modals.openConfirmModal({
      title: 'Delete mocks',
      centered: true,
      children: (
        <Text size="sm">
          You are about to delete <strong>{scenarios.length} mocks scenarios</strong>.
          <Space h="md" />
          Are you sure you want to delete these mocks?
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        const updatedWorkspaceStore = storeActions.deleteMocks(
          workspaceStore,
          scenarios.map((m) => m.id)
        );

        storeActions
          .updateWorkspaceStoreInDB(selectedWorkspace.id, updatedWorkspaceStore)
          .then(setStoreProperties)
          .then(() => {
            storeActions.refreshContentStore(tab.id);
            notifications.show({
              title: `${scenarios.length} mocks deleted`,
              message: `Mocks are deleted successfully.`
            });
          })
          .catch((error) => {
            console.log(error);
            notifications.show({
              title: 'Cannot delete mocks.',
              message: 'Something went wrong, unable to delete mocks. Check console for error.',
              color: 'red'
            });
          });
      }
    });
  };

  const duplicateMock = (mock: IMockResponse) => {
    setSelectedMock({
      ...mock,
      name: `${mock.name} copy`,
      description: '',
      id: undefined,
      createdOn: undefined,
      selected: false
    });
  };

  const addMockToGroup = (groupId: string) => {
    setSelectedMock({ groupId });
  };

  const editMock = (mock: IMockResponse) => {
    setSelectedMock(mock);
  };

  const selectMockScenario = (mock: IMockResponse) => {
    const scenarios = getMockScenarios(mock);
    const mocksUpdated = scenarios.map((m) => ({
      ...m,
      selected: m.id === mock.id
    }));

    const updatedWorkspaceStore = storeActions.updateMocks(workspaceStore, mocksUpdated);
    storeActions
      .updateWorkspaceStoreInDB(selectedWorkspace.id, updatedWorkspaceStore)
      .then(setStoreProperties)
      .then(() => storeActions.refreshContentStore(tab.id));
  };

  return {
    getMocksByGroup,
    getMockScenarios,
    selectMockScenario,
    isActiveGroupByMock,
    toggleMock,
    addMockToGroup,
    deleteMock,
    deleteMockScenarios,
    duplicateMock,
    editMock
  };
};
