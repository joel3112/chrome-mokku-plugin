import * as React from 'react';
import { shallow } from 'zustand/shallow';
import { Space, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useChromeStore, useChromeStoreState, useGlobalStore } from '@mokku/store';
import { IMockGroup } from '@mokku/types';
import { storeActions } from '../service/storeActions';

const useGroupStoreSelector = (state: useChromeStoreState) => ({
  workspaceStore: state.workspaceStore,
  selectedWorkspace: state.selectedWorkspace,
  setStoreProperties: state.setStoreProperties,
  setSelectedGroup: state.setSelectedGroup
});

export const useGroupActions = () => {
  const { workspaceStore, selectedWorkspace, setSelectedGroup, setStoreProperties } =
    useChromeStore(useGroupStoreSelector, shallow);
  const tab = useGlobalStore((state) => state.meta.tab);

  const toggleGroup = (groupToBeUpdated: IMockGroup) => {
    const updatedWorkspaceStore = storeActions.updateGroups(workspaceStore, groupToBeUpdated);
    const groupStatus = groupToBeUpdated.active ? 'is enabled' : 'is disabled';

    storeActions
      .updateWorkspaceStoreInDB(selectedWorkspace.id, updatedWorkspaceStore)
      .then(setStoreProperties)
      .then(() => {
        storeActions.refreshContentStore(tab.id);
        notifications.show({
          title: `"${groupToBeUpdated.name}" is ${groupStatus}`,
          message: `Group ${groupStatus}`
        });
      })
      .catch(() => {
        notifications.show({
          title: 'Cannot updated group.',
          message: 'Something went wrong, unable to update group.',
          color: 'red'
        });
      });
  };

  const doDeleteGroup = (groupToBeDeleted: IMockGroup) => {
    const updatedWorkspaceStore = storeActions.deleteGroups(workspaceStore, groupToBeDeleted.id);

    storeActions
      .updateWorkspaceStoreInDB(selectedWorkspace.id, updatedWorkspaceStore)
      .then(setStoreProperties)
      .then(() => {
        storeActions.refreshContentStore(tab.id);
        notifications.show({
          title: `"${groupToBeDeleted.name}" group deleted`,
          message: `Group "${groupToBeDeleted.name}" is deleted successfully.`
        });
      })
      .catch((error) => {
        console.log(error);
        notifications.show({
          title: 'Cannot delete group.',
          message: 'Something went wrong, unable to delete group. Check console for error.',
          color: 'red'
        });
      });
  };

  const deleteGroup = (groupToBeDeleted: IMockGroup) => {
    const mocksInGroup = storeActions.getMocksByGroup(workspaceStore, groupToBeDeleted.id);

    if (mocksInGroup.length === 0) {
      doDeleteGroup(groupToBeDeleted);
      return;
    }

    modals.openConfirmModal({
      title: 'Delete group',
      centered: true,
      children: (
        <Text size="sm">
          The group <strong>{groupToBeDeleted.name}</strong> contains{' '}
          <strong>{mocksInGroup.length} mocks</strong>. Deleting this group will delete all mocks in
          this group.
          <Space h="md" />
          Are you sure you want to delete this group?
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => doDeleteGroup(groupToBeDeleted)
    });
  };

  const duplicateGroup = (group: IMockGroup) => {
    setSelectedGroup({ ...group, createdOn: undefined });
  };

  const editGroup = (group: IMockGroup) => {
    setSelectedGroup(group);
  };

  return { toggleGroup, deleteGroup, duplicateGroup, editGroup };
};
