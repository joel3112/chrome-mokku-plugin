import { shallow } from 'zustand/shallow';
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

  const deleteGroup = (groupToBeDeleted: IMockGroup) => {
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

  const duplicateGroup = (group: IMockGroup) => {
    setSelectedGroup({ ...group, createdOn: undefined });
  };

  const editGroup = (group: IMockGroup) => {
    setSelectedGroup(group);
  };

  return { toggleGroup, deleteGroup, duplicateGroup, editGroup };
};
