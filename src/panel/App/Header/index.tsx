import React, { useEffect } from 'react';
import { TbChevronDown, TbClearAll, TbPlus, TbSearch, TbTrash } from 'react-icons/tb';
import { shallow } from 'zustand/shallow';
import {
  Button,
  CloseButton,
  Flex,
  Menu,
  Tabs,
  Text,
  TextInput,
  createStyles,
  rem
} from '@mantine/core';
import { sortCollectionByName } from '@mokku/services';
import {
  ViewEnum,
  useChromeStore,
  useChromeStoreState,
  useGlobalStore,
  useGlobalStoreState,
  useLogStore
} from '@mokku/store';
import { DEFAULT_WORKSPACE, storeActions } from '../service/storeActions';
import { RecordButton } from './RecordButton';
import { RefreshButton } from './RefreshButton';
import { SettingsButton } from './SettingsButton';
import { SwitchButton } from './SwitchButton';
import { ThemeButton } from './ThemeButton';
import { useWorkspaceActions } from './Workspace.action';

const viewSelector = (state: useGlobalStoreState) => ({
  view: state.view,
  setView: state.setView,
  search: state.search,
  setSearch: state.setSearch
});

const useMockStoreSelector = (state: useChromeStoreState) => ({
  store: state.store,
  selectedWorkSpace: state.selectedWorkspace,
  setSelectedWorkSpace: state.setSelectedWorkspace,
  setSelectedGroup: state.setSelectedGroup,
  setSelectedMock: state.setSelectedMock
});

const HEIGHT_TABS = 50;
export const MAX_WIDTH_LAYOUT = 1100;

const useStyles = createStyles((theme) => ({
  active: {
    backgroundColor: theme.colors[theme.primaryColor][6],
    color: theme.white
  },
  tabContainer: {
    borderBottom: `${rem(2)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    marginBottom: rem(12)
  },
  tabList: {
    width: '100%',
    maxWidth: MAX_WIDTH_LAYOUT,
    height: HEIGHT_TABS,
    margin: '0 auto',
    alignItems: 'center',
    borderBottom: 'none'
  }
}));

export const Header = () => {
  const clearLogs = useLogStore((state) => state.clearLogs);
  const { view, setView, search, setSearch } = useGlobalStore(viewSelector, shallow);
  const { store, selectedWorkSpace, setSelectedWorkSpace, setSelectedMock, setSelectedGroup } =
    useChromeStore(useMockStoreSelector, shallow);

  const { addWorkspace, selectWorkspace, deleteWorkspace } = useWorkspaceActions();

  useEffect(() => {
    setSelectedWorkSpace(storeActions.getActiveWorkspace(store));
  }, [store.workspaces]);

  const { classes, cx } = useStyles();

  return (
    <>
      <Tabs
        defaultValue={ViewEnum.MOCKS}
        value={view}
        onTabChange={setView}
        className={classes.tabContainer}>
        <Tabs.List className={classes.tabList}>
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

          <Tabs.Tab value={ViewEnum.MOCKS} h={HEIGHT_TABS}>
            <Text>Mocks</Text>
          </Tabs.Tab>
          <Tabs.Tab value={ViewEnum.LOGS} h={HEIGHT_TABS}>
            <Text>Logs</Text>
          </Tabs.Tab>
          {view !== ViewEnum.SETTINGS && (
            <Flex align="center" gap={8} ml={6}>
              {view === ViewEnum.MOCKS ? (
                <>
                  <SettingsButton variant="default" onClick={() => setSelectedGroup({})}>
                    Add Group
                  </SettingsButton>
                  <SettingsButton onClick={() => setSelectedMock({})}>Add Mock</SettingsButton>
                </>
              ) : (
                <SettingsButton variant="default" Icon={TbClearAll} onClick={clearLogs}>
                  Clear Logs
                </SettingsButton>
              )}
              <TextInput
                icon={<TbSearch />}
                rightSection={search && <CloseButton onClick={() => setSearch('')} />}
                placeholder="Search..."
                size="xs"
                w={200}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <RecordButton />
            </Flex>
          )}

          <Tabs.Tab value={ViewEnum.SETTINGS} h={HEIGHT_TABS} ml="auto">
            <Text>Settings</Text>
          </Tabs.Tab>
          <Flex gap={4} pr={14} pl={6}>
            <ThemeButton />
            <RefreshButton />
            <SwitchButton />
          </Flex>
        </Tabs.List>
      </Tabs>
    </>
  );
};
