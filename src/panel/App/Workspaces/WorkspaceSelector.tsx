import React, { useEffect } from 'react';
import { TbChevronDown, TbLock, TbPlus, TbTrash } from 'react-icons/tb';
import { shallow } from 'zustand/shallow';
import { Button, Flex, Menu, createStyles } from '@mantine/core';
import { sortCollectionByName } from '@mokku/services';
import { useChromeStore, useChromeStoreState } from '@mokku/store';
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

  const { addWorkspace, selectWorkspace, deleteWorkspace } = useWorkspaceActions();
  const { classes, cx } = useStyles();

  useEffect(() => {
    setSelectedWorkSpace(storeActions.getActiveWorkspace(store));
  }, [store.workspaces]);

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
            onClick={() => selectWorkspace(workspace)}
            className={cx({ [classes.active]: workspace.id === selectedWorkspace?.id })}>
            <Flex justify="space-between" align="center">
              {workspace.name}
              {isDefaultWorkspace(workspace) && <TbLock />}
            </Flex>
          </Menu.Item>
        ))}
        <Menu.Divider />

        <Menu.Item icon={<TbPlus />} onClick={addWorkspace}>
          Add workspace
        </Menu.Item>
        <Menu.Item
          color="red"
          icon={<TbTrash />}
          disabled={isDefaultWorkspace(selectedWorkspace)}
          onClick={() => deleteWorkspace(selectedWorkspace)}>
          Delete workspace
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
