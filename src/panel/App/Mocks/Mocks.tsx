import React from 'react';
import { shallow } from 'zustand/shallow';
import { LoadingOverlay } from '@mantine/core';
import { filterBySearch, sortCollectionByName, uniqueItemsByKeys } from '@mokku/services';
import { useChromeStore, useChromeStoreState, useGlobalStore } from '@mokku/store';
import { IMockGroup, IMockResponse, MockType } from '@mokku/types';
import { Placeholder } from '../Blocks/Placeholder';
import { TableWrapper } from '../Blocks/Table';
import { storeActions } from '../service/storeActions';
import { useMocksTableSchema } from './useMocksTableSchema';

const useMockStoreSelector = (state: useChromeStoreState) => ({
  store: state.store,
  workspaceStore: state.workspaceStore,
  selectedWorkspace: state.selectedWorkspace,
  selectedGroup: state.selectedGroup,
  setSelectedMock: state.setSelectedMock,
  selectedMock: state.selectedMock,
  setStoreProperties: state.setStoreProperties
});

export const Mocks = () => {
  const {
    store,
    workspaceStore,
    selectedWorkspace,
    selectedMock,
    setSelectedMock,
    selectedGroup,
    setStoreProperties
  } = useChromeStore(useMockStoreSelector, shallow);
  const search = useGlobalStore((state) => state.search).toLowerCase();
  const schema = useMocksTableSchema();

  let filteredMocks: (IMockResponse | IMockGroup)[] = [
    ...filterBySearch(workspaceStore.mocks || [], search)
  ];
  (workspaceStore.groups || []).forEach((group) => {
    const groupHasFilteredMock = filteredMocks.some((mock) => mock['groupId'] === group.id);
    const groupMatchesSearch = filterBySearch([group], search).length > 0;
    if (groupHasFilteredMock || groupMatchesSearch) {
      filteredMocks.push(group);
    }
  });

  function organizeItems(items: (IMockResponse | IMockGroup)[]): (IMockResponse | IMockGroup)[] {
    // Separate items into groups and mocks
    const groups = [];
    const mocks = [];

    items.forEach((item) => {
      if (item.type === 'group') {
        groups.push(item);
      } else if (item.type === 'mock') {
        mocks.push(item);
      }
    });

    const uniqueMocks = store.enabledScenarios
      ? uniqueItemsByKeys(mocks, ['url', 'method', 'groupId'], 'selected')
      : mocks;

    // Map group IDs to their respective mocks
    const groupedMocks = {};
    uniqueMocks.forEach((mock) => {
      if (mock.groupId) {
        if (!groupedMocks[mock.groupId]) {
          groupedMocks[mock.groupId] = [];
        }
        groupedMocks[mock.groupId].push(mock);
      }
    });

    // Reconstruct the ordered array
    const result = [];
    sortCollectionByName([...groups, ...uniqueMocks]).forEach((item) => {
      if (item.type === 'group') {
        result.push(item);
        // Add mocks associated with this group
        if (groupedMocks[item.id]) {
          result.push(...sortCollectionByName(groupedMocks[item.id]));
        }
      } else if (item.type === 'mock' && !item.groupId) {
        result.push(item);
      }
    });

    return result;
  }

  if (!workspaceStore.mocks || !workspaceStore.groups) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  if (workspaceStore.mocks.length === 0 && workspaceStore.groups.length === 0) {
    return (
      <Placeholder
        title="No Mocks created yet."
        description="Create a mock from scratch or mock a log from logs."
      />
    );
  }

  if (filteredMocks.length === 0) {
    return (
      <Placeholder
        title="No matched mock."
        description="No mock is matching the current search, you can search by name, url, method or status."
      />
    );
  }

  // console.log(
  //   'Mocks',
  //   filteredMocks.map((m) => ({
  //     id: m.id,
  //     name: m.name,
  //     type: m.type,
  //     url: m['url'],
  //     method: m['method']
  //   }))
  // );

  const selectRow = (data: IMockResponse | IMockGroup) => {
    if (data.type === MockType.GROUP) {
      const updatedWorkspaceStore = storeActions.updateGroups(workspaceStore, {
        ...data,
        expanded: !data.expanded
      });
      storeActions
        .updateWorkspaceStoreInDB(selectedWorkspace.id, updatedWorkspaceStore)
        .then(setStoreProperties);
      return;
    }
    setSelectedMock(data);
  };

  return (
    <TableWrapper
      onRowClick={selectRow}
      selectedRowId={selectedGroup?.id || selectedMock?.id}
      data={organizeItems(filteredMocks)}
      schema={schema}
    />
  );
};
