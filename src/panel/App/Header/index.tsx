import React, { useState } from 'react';
import { TbSearch } from 'react-icons/tb';
import { shallow } from 'zustand/shallow';
import { Button, Flex, Input, Tabs } from '@mantine/core';
import { ViewEnum, useChromeStore, useGlobalStore, useGlobalStoreState } from '../store';
import { ClearButton } from './ClearButton';
import { RecordButton } from './RecordButton';
import { RefreshButton } from './RefreshButton';
import { Settings } from './Settings';
import { SwitchButton } from './SwitchButton';
import { ThemeButton } from './ThemeButton';

const viewSelector = (state: useGlobalStoreState) => ({
  view: state.view,
  setView: state.setView,
  search: state.search,
  setSearch: state.setSearch
});

export const Header = () => {
  const { view, setView, search, setSearch } = useGlobalStore(viewSelector, shallow);

  const store = useChromeStore((state) => state.store);
  const setSelectedMock = useChromeStore((state) => state.setSelectedMock);
  const setSelectedGroup = useChromeStore((state) => state.setSelectedGroup);
  const [showSettings, setShowSettings] = useState(false);
  const HEIGHT_TABS = 50;

  return (
    <Tabs defaultValue={ViewEnum.MOCKS} value={view} onTabChange={setView}>
      <Tabs.List style={{ width: '100%', height: HEIGHT_TABS }}>
        <Flex justify="space-between" align="center" style={{ width: '100%' }}>
          <Flex align="center">
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
          {showSettings && <Settings store={store} onClose={() => setShowSettings(false)} />}
        </Flex>
      </Tabs.List>
    </Tabs>
  );
};
