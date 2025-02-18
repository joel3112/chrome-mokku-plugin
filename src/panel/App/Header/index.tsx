import React from 'react';
import { TbClearAll, TbSearch } from 'react-icons/tb';
import { shallow } from 'zustand/shallow';
import { CloseButton, Flex, Tabs, Text, TextInput, createStyles, rem } from '@mantine/core';
import {
  ViewEnum,
  useChromeStore,
  useChromeStoreState,
  useGlobalStore,
  useGlobalStoreState,
  useLogStore
} from '@mokku/store';
import { WorkspaceSelector } from '../Workspaces/WorkspaceSelector';
import { RecordButton } from './RecordButton';
import { RefreshButton } from './RefreshButton';
import { SettingsButton } from './SettingsButton';
import { SwitchButton } from './SwitchButton';
import { ThemeButton } from './ThemeButton';

const viewSelector = (state: useGlobalStoreState) => ({
  view: state.view,
  setView: state.setView,
  search: state.search,
  setSearch: state.setSearch
});

const useMockStoreSelector = (state: useChromeStoreState) => ({
  setSelectedGroup: state.setSelectedGroup,
  setSelectedMock: state.setSelectedMock
});

const HEIGHT_TABS = 50;
export const MAX_WIDTH_LAYOUT = 1100;

const useStyles = createStyles((theme) => ({
  tabContainer: {
    borderBottom: `${rem(2)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    marginBottom: rem(12)
  },
  tabList: {
    width: '100%',
    maxWidth: MAX_WIDTH_LAYOUT,
    height: HEIGHT_TABS - 2,
    margin: '0 auto',
    alignItems: 'center',
    borderBottom: 'none'
  }
}));

export const Header = () => {
  const clearLogs = useLogStore((state) => state.clearLogs);
  const { view, setView, search, setSearch } = useGlobalStore(viewSelector, shallow);
  const { setSelectedMock, setSelectedGroup } = useChromeStore(useMockStoreSelector, shallow);

  const { classes } = useStyles();

  return (
    <>
      <Tabs
        defaultValue={ViewEnum.MOCKS}
        value={view}
        onTabChange={setView}
        className={classes.tabContainer}>
        <Tabs.List className={classes.tabList}>
          <WorkspaceSelector />
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
