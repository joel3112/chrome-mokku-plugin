import React, { useEffect } from 'react';
import { TbChevronDown, TbPlus, TbSearch, TbTrash } from 'react-icons/tb';
import { shallow } from 'zustand/shallow';
import { Button, Flex, Input, Menu, Modal, Tabs, Text, createStyles } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { sortCollectionByName } from '@mokku/services';
import {
  ViewEnum,
  useChromeStore,
  useChromeStoreState,
  useGlobalStore,
  useGlobalStoreState
} from '@mokku/store';
import { DEFAULT_WORKSPACE, storeActions } from '../service/storeActions';
import { AddButton } from './AddButton';
import { ClearButton } from './ClearButton';
import { CloseButton } from './CloseButton';
import { RecordButton } from './RecordButton';
import { RefreshButton } from './RefreshButton';
import { Settings } from './Settings';
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

const useStyles = createStyles((theme) => ({
  active: {
    backgroundColor: theme.colors[theme.primaryColor][6],
    color: theme.white
  }
}));

export const Header = () => {
  const { view, setView, search, setSearch } = useGlobalStore(viewSelector, shallow);
  const { store, selectedWorkSpace, setSelectedWorkSpace, setSelectedMock, setSelectedGroup } =
    useChromeStore(useMockStoreSelector, shallow);

  const { addWorkspace, selectWorkspace, deleteWorkspace } = useWorkspaceActions();

  useEffect(() => {
    setSelectedWorkSpace(storeActions.getActiveWorkspace(store));
  }, [store.workspaces]);

  const [settingsIsOpened, { open: openSettingsModal, close: closeSettingsModal }] =
    useDisclosure(false);
  const { classes, cx } = useStyles();
  const HEIGHT_TABS = 50;

  return (
    <Tabs defaultValue={ViewEnum.MOCKS} value={view} onTabChange={setView}>
      <Tabs.List style={{ width: '100%', height: HEIGHT_TABS }}>
        <Flex justify="space-between" align="center" style={{ width: '100%' }}>
          <Flex align="center">
            <Menu width={200}>
              <Menu.Target>
                <Button variant="subtle" rightIcon={<TbChevronDown />} size="xs">
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
            <Tabs.Tab value={ViewEnum.MOCKS} style={{ height: HEIGHT_TABS }}>
              <Text size="xs">Mocks</Text>
            </Tabs.Tab>
            <Tabs.Tab value={ViewEnum.LOGS} style={{ height: HEIGHT_TABS }}>
              <Text size="xs">Logs</Text>
            </Tabs.Tab>
            <Flex align="center" gap={8} ml={12}>
              {view === ViewEnum.MOCKS ? (
                <>
                  <AddButton onClick={() => setSelectedGroup({})}>Add Group</AddButton>
                  <AddButton onClick={() => setSelectedMock({})}>Add Mock</AddButton>
                </>
              ) : null}
              <Input
                icon={<TbSearch />}
                placeholder="Search..."
                size="xs"
                defaultValue={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <RecordButton />
              {view === ViewEnum.LOGS ? <ClearButton /> : null}
            </Flex>
          </Flex>
          <Flex gap="4px" style={{ paddingRight: 4 }}>
            <Button onClick={openSettingsModal} size="xs" variant="subtle">
              Settings
            </Button>
            <ThemeButton />
            <RefreshButton />
            <SwitchButton />
          </Flex>
          <Modal.Root
            opened={settingsIsOpened}
            onClose={closeSettingsModal}
            autoFocus
            fullScreen
            transitionProps={{ transition: 'fade', duration: 200 }}>
            <Modal.Content>
              <Modal.Header>
                <div></div>
                <CloseButton onClick={closeSettingsModal} />
              </Modal.Header>
              <Modal.Body>
                <Settings onClose={closeSettingsModal} />
              </Modal.Body>
            </Modal.Content>
          </Modal.Root>
        </Flex>
      </Tabs.List>
    </Tabs>
  );
};
