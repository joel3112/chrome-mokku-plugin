import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { shallow } from 'zustand/shallow';
import { Button, Space, Text, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { extractJsonFromFile } from '@mokku/services';
import {
  ViewEnum,
  useChromeStore,
  useChromeStoreState,
  useGlobalStore,
  useGlobalStoreState
} from '@mokku/store';
import { IWorkspace } from '@mokku/types';
import { DEFAULT_WORKSPACE, storeActions } from '../service/storeActions';

const viewSelector = (state: useGlobalStoreState) => ({
  meta: state.meta,
  setView: state.setView
});

const useMockStoreSelector = (state: useChromeStoreState) => ({
  initWorkspace: state.init,
  store: state.store,
  workspaceStore: state.workspaceStore,
  setStoreProperties: state.setStoreProperties,
  setSelectedWorkSpace: state.setSelectedWorkspace
});

export const useWorkspaceActions = () => {
  const { meta, setView } = useGlobalStore(viewSelector, shallow);
  const { initWorkspace, store, workspaceStore, setStoreProperties, setSelectedWorkSpace } =
    useChromeStore(useMockStoreSelector, shallow);

  const addWorkspace = () => {
    modals.open({
      title: 'Add Workspace',
      children: (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = e.target['name'].value;
            const workspaceId = uuidv4();
            const updatedStore = storeActions.addWorkspace(store, { name, id: workspaceId });

            storeActions.updateStoreInDB(updatedStore).then((res) => {
              setStoreProperties(res);
              selectWorkspace(res.store.workspaces[workspaceId], res.store);
              modals.closeAll();
            });
          }}>
          <TextInput required name="name" label="Name" placeholder="My workspace" data-autofocus />
          <Button fullWidth type="submit" mt="md">
            Submit
          </Button>
        </form>
      )
    });
  };

  const selectWorkspace = (workspace: IWorkspace, _store = store) => {
    const updatedStore = storeActions.selectWorkspace(_store, workspace.id);

    storeActions
      .updateStoreInDB(updatedStore)
      .then(initWorkspace)
      .then(() => {
        storeActions.refreshContentStore(meta.tab.id);
        setView(ViewEnum.MOCKS);
      });
  };

  const changeNameWorkspace = (workspace: IWorkspace, name: string) => {
    const updatedStore = storeActions.changeNameWorkspace(store, workspace.id, name);

    return storeActions
      .updateStoreInDB(updatedStore)
      .then(setStoreProperties)
      .then(() => {
        storeActions.refreshContentStore(meta.tab.id);
        notifications.show({
          title: 'Workspace updated',
          message: 'Workspace name updated successfully'
        });
      });
  };

  const deleteWorkspace = (workspace: IWorkspace, onConfirm?: () => void) => {
    const mocksInWorkspace = workspaceStore.mocks;
    const groupsInWorkspace = workspaceStore.groups;

    modals.openConfirmModal({
      title: 'Delete workspace',
      centered: true,
      children: (
        <Text size="sm">
          The workspace <strong>{workspace.name}</strong> contains{' '}
          <strong>{groupsInWorkspace.length} groups</strong> and{' '}
          <strong>{mocksInWorkspace.length} mocks</strong>. Deleting this workspace will delete all
          mocks and groups in this workspace.
          <Space h="md" />
          Are you sure you want to delete this workspace?
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        const updatedStore = storeActions.deleteWorkspace(store, workspace.id);
        setSelectedWorkSpace(store.workspaces[DEFAULT_WORKSPACE]);

        storeActions
          .updateStoreInDB(updatedStore)
          .then(() => storeActions.deleteWorkspaceStoreInDB(workspace.id))
          .then((res) => {
            setStoreProperties(res);
            onConfirm?.();
          })
          .then(() => {
            storeActions.refreshContentStore(meta.tab.id);
            setView(ViewEnum.MOCKS);
            notifications.show({
              title: `"${workspace.name}" workspace deleted`,
              message: `Workspace "${workspace.name}" is deleted successfully.`
            });
          })
          .catch((error) => {
            console.log(error);
            notifications.show({
              title: 'Cannot delete workspace.',
              message: 'Something went wrong, unable to delete workspace. Check console for error.',
              color: 'red'
            });
          });
      }
    });
  };

  const importWorkspace = async (workspace: IWorkspace, file: File) => {
    try {
      const jsonData = await extractJsonFromFile(file);
      const updatedWorkspaceStore = { ...workspaceStore, ...jsonData };
      storeActions
        .updateWorkspaceStoreInDB(workspace.id, updatedWorkspaceStore)
        .then(setStoreProperties)
        .then(() => {
          storeActions.refreshContentStore(meta.tab.id);
          setView(ViewEnum.MOCKS);
          notifications.show({
            title: `Import data`,
            message: `Data imported successfully`
          });
        });
    } catch (error) {
      console.error('Failed to import data:', error);
      notifications.show({
        id: 'import-data-error',
        title: `Import data`,
        message: `Failed to import data`,
        color: 'red'
      });
    }
  };

  const resetWorkspace = (workspace: IWorkspace, onConfirm?: () => void) => {
    modals.openConfirmModal({
      title: 'Clear data',
      centered: true,
      children: (
        <Text size="sm">
          This action is destructive and you will lose all your data for the workspace{' '}
          <strong>{workspace.name}</strong>.
          <Space h="md" />
          This action is destructive and you will lose
        </Text>
      ),
      labels: { confirm: 'Clear', cancel: "No don't clear it" },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        storeActions
          .resetWorkspaceStore(workspace.id)
          .then((res) => {
            setStoreProperties(res);
            onConfirm?.();
          })
          .then(() => {
            storeActions.refreshContentStore(meta.tab.id);
            setView(ViewEnum.MOCKS);
            notifications.show({
              title: `Clear data`,
              message: `All data cleared successfully`
            });
          })
          .catch((error) => {
            console.log(error);
            notifications.show({
              title: 'Cannot clear data.',
              message: 'Something went wrong, unable to clear data. Check console for error.',
              color: 'red'
            });
          });
      }
    });
  };

  return {
    addWorkspace,
    selectWorkspace,
    changeNameWorkspace,
    deleteWorkspace,
    resetWorkspace,
    importWorkspace
  };
};
