import React, { useEffect, useState } from 'react';
import { TbChevronDown, TbPlus, TbSearch, TbTrash } from 'react-icons/tb';
import { shallow } from 'zustand/shallow';
import { Button, Flex, Input, Menu, Tabs, TextInput, createStyles } from '@mantine/core';
import { modals } from '@mantine/modals';
import { sortCollectionByName } from '@mokku/services';
import {
  ViewEnum,
  useChromeStore,
  useChromeStoreState,
  useGlobalStore,
  useGlobalStoreState
} from '@mokku/store';
import { IWorkspace } from '@mokku/types';
import { storeActions } from '../service/storeActions';
import { ClearButton } from './ClearButton';
import { RecordButton } from './RecordButton';
import { RefreshButton } from './RefreshButton';
import { Settings } from './Settings';
import { SwitchButton } from './SwitchButton';
import { ThemeButton } from './ThemeButton';

const viewSelector = (state: useGlobalStoreState) => ({
  meta: state.meta,
  view: state.view,
  setView: state.setView,
  search: state.search,
  setSearch: state.setSearch
});

const useMockStoreSelector = (state: useChromeStoreState) => ({
  initWorkspace: state.init,
  store: state.store,
  selectedWorkSpace: state.selectedWorkspace,
  setSelectedWorkSpace: state.setSelectedWorkspace,
  setSelectedGroup: state.setSelectedGroup,
  setSelectedMock: state.setSelectedMock,
  setStoreProperties: state.setStoreProperties
});

const useStyles = createStyles((theme) => ({
  active: {
    backgroundColor: theme.colors[theme.primaryColor][6],
    color: theme.white
  }
}));

export const Header = () => {
  const { meta, view, setView, search, setSearch } = useGlobalStore(viewSelector, shallow);

  const {
    initWorkspace,
    store,
    selectedWorkSpace,
    setSelectedWorkSpace,
    setSelectedMock,
    setSelectedGroup,
    setStoreProperties
  } = useChromeStore(useMockStoreSelector, shallow);

  useEffect(() => {
    setSelectedWorkSpace(storeActions.getActiveWorkspace(store));
  }, [store.workspaces]);

  const [showSettings, setShowSettings] = useState(false);
  const { classes, cx } = useStyles();
  const HEIGHT_TABS = 50;

  const handleAddWorkspace = () => {
    modals.open({
      title: 'Add Workspace',
      children: (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = e.target['name'].value;
            const updatedStore = storeActions.addWorkspace(store, name);

            storeActions.updateStoreInDB(updatedStore).then((res) => {
              setStoreProperties(res);
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

  const handleSelectWorkspace = async (workspace: IWorkspace) => {
    const updatedStore = storeActions.selectWorkspace(store, workspace.id);

    storeActions
      .updateStoreInDB(updatedStore)
      .then(initWorkspace)
      .then(() => {
        storeActions.refreshContentStore(meta.tab.id);
      });
  };

  return (
    <Tabs defaultValue={ViewEnum.MOCKS} value={view} onTabChange={setView}>
      <Tabs.List style={{ width: '100%', height: HEIGHT_TABS }}>
        <Flex justify="space-between" align="center" style={{ width: '100%' }}>
          <Flex align="center">
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button variant="subtle" rightIcon={<TbChevronDown />}>
                  {selectedWorkSpace?.name}
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Workspaces</Menu.Label>
                {sortCollectionByName(Object.values(store.workspaces)).map((workspace) => (
                  <Menu.Item
                    key={workspace.id}
                    onClick={() => handleSelectWorkspace(workspace)}
                    className={cx({ [classes.active]: workspace.id === selectedWorkSpace?.id })}>
                    {workspace.name}
                  </Menu.Item>
                ))}
                <Menu.Divider />

                <Menu.Item icon={<TbPlus />} onClick={handleAddWorkspace}>
                  Add workspace
                </Menu.Item>
                <Menu.Item color="red" icon={<TbTrash />}>
                  Delete workspace
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Tabs.Tab value={ViewEnum.MOCKS} style={{ height: HEIGHT_TABS }}>
              Mocks
            </Tabs.Tab>
            <Tabs.Tab value={ViewEnum.LOGS} style={{ height: HEIGHT_TABS }}>
              Logs
            </Tabs.Tab>
            <Flex align="center" gap={8}>
              <Flex align="center" gap={0}>
                <Button onClick={() => setSelectedGroup({})} size="xs" variant="subtle">
                  + Add Group
                </Button>
                <Button onClick={() => setSelectedMock({})} size="xs" variant="subtle">
                  + Add Mock
                </Button>
              </Flex>

              <Input
                icon={<TbSearch />}
                placeholder="Search..."
                size="xs"
                defaultValue={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <RecordButton />
              {view === 'LOGS' ? <ClearButton /> : null}
            </Flex>
          </Flex>
          <Flex gap="4px" style={{ paddingRight: 4 }}>
            <Button onClick={() => setShowSettings(true)} size="xs" variant="subtle">
              Settings
            </Button>
            <ThemeButton />
            <RefreshButton />
            <SwitchButton />
          </Flex>
          {showSettings && <Settings onClose={() => setShowSettings(false)} />}
        </Flex>
      </Tabs.List>
    </Tabs>
  );
};
