import React, { useEffect } from 'react';
import { TbChevronDown, TbLock, TbPlus, TbTrash } from 'react-icons/tb';
import { shallow } from 'zustand/shallow';
import { Button, Flex, Menu, createStyles } from '@mantine/core';
import { sortCollectionByName } from '@mokku/services';
import { useChromeStore, useChromeStoreState, useGlobalStore } from '@mokku/store';
import { IWorkspace } from '@mokku/types';
import { DEFAULT_WORKSPACE, storeActions } from '../service/storeActions';
import { useWorkspaceActions } from './Workspace.action';

const useMockStoreSelector = (state: useChromeStoreState) => ({
  store: state.store,
  selectedWorkspace: state.selectedWorkspace,
  setSelectedWorkSpace: state.setSelectedWorkspace
});

const useStyles = createStyles((theme) => ({
  active: {
    backgroundColor: theme.colors[theme.primaryColor][6],
    color: theme.white
  }
}));

export const WorkspaceSelector = () => {
  const { store, selectedWorkspace, setSelectedWorkSpace } = useChromeStore(
    useMockStoreSelector,
    shallow
  );
  const isDefaultWorkspace = (w: IWorkspace) => w?.id === DEFAULT_WORKSPACE;
  const host = useGlobalStore((state) => state.meta.host);

  const { addWorkspace, selectWorkspace, deleteWorkspace } = useWorkspaceActions();
  const { classes, cx } = useStyles();

  useEffect(() => {
    storeActions.getActiveWorkspaceForHost(store, host).then(setSelectedWorkSpace);
  }, [store.workspaces, host]);

  const handleReload = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (store.enabledReloadWorkspaceChanged) {
        chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
      }
    });
  };

  return (
    <Menu width={200} position="bottom-start">
      <Menu.Target>
        <Button variant="subtle" rightIcon={<TbChevronDown />}>
          {selectedWorkspace?.name}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Your workspaces</Menu.Label>
        {sortCollectionByName(Object.values(store.workspaces)).map((workspace) => (
          <Menu.Item
            key={workspace.id}
            onClick={() => selectWorkspace(workspace, undefined, handleReload)}
            className={cx({ [classes.active]: workspace.id === selectedWorkspace?.id })}>
            <Flex justify="space-between" align="center">
              {workspace.name}
              {isDefaultWorkspace(workspace) && <TbLock title="Default isn't removable" />}
            </Flex>
          </Menu.Item>
        ))}
        <Menu.Divider />

        <Menu.Item icon={<TbPlus />} onClick={() => addWorkspace(handleReload)}>
          Add workspace
        </Menu.Item>
        <Menu.Item
          color="red"
          icon={<TbTrash />}
          disabled={isDefaultWorkspace(selectedWorkspace)}
          onClick={() => deleteWorkspace(selectedWorkspace, handleReload)}>
          Delete workspace
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
