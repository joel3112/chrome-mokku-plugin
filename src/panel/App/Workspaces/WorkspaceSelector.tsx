import React, { useEffect } from 'react';
import { TbChevronDown, TbPlus, TbTrash } from 'react-icons/tb';
import { shallow } from 'zustand/shallow';
import { Button, Menu, createStyles } from '@mantine/core';
import { sortCollectionByName } from '@mokku/services';
import { useChromeStore, useChromeStoreState } from '@mokku/store';
import { DEFAULT_WORKSPACE, storeActions } from '../service/storeActions';
import { useWorkspaceActions } from './Workspace.action';

const useMockStoreSelector = (state: useChromeStoreState) => ({
  store: state.store,
  selectedWorkSpace: state.selectedWorkspace,
  setSelectedWorkSpace: state.setSelectedWorkspace
});

const useStyles = createStyles((theme) => ({
  active: {
    backgroundColor: theme.colors[theme.primaryColor][6],
    color: theme.white
  }
}));

export const WorkspaceSelector = () => {
  const { store, selectedWorkSpace, setSelectedWorkSpace } = useChromeStore(
    useMockStoreSelector,
    shallow
  );

  const { addWorkspace, selectWorkspace, deleteWorkspace } = useWorkspaceActions();
  const { classes, cx } = useStyles();

  useEffect(() => {
    setSelectedWorkSpace(storeActions.getActiveWorkspace(store));
  }, [store.workspaces]);

  return (
    <Menu width={200} position="bottom-start">
      <Menu.Target>
        <Button variant="subtle" rightIcon={<TbChevronDown />}>
          {selectedWorkSpace?.name}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Your workspaces</Menu.Label>
        {sortCollectionByName(Object.values(store.workspaces)).map((workspace) => (
          <Menu.Item
            key={workspace.id}
            onClick={() => selectWorkspace(workspace)}
            className={cx({ [classes.active]: workspace.id === selectedWorkSpace?.id })}>
            {workspace.name}
          </Menu.Item>
        ))}
        <Menu.Divider />

        <Menu.Item icon={<TbPlus />} onClick={addWorkspace}>
          Add workspace
        </Menu.Item>
        <Menu.Item
          color="red"
          icon={<TbTrash />}
          disabled={selectedWorkSpace?.id === DEFAULT_WORKSPACE}
          onClick={() => deleteWorkspace(selectedWorkSpace)}>
          Delete workspace
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
