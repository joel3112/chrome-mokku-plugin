import React from 'react';
import { shallow } from 'zustand/shallow';
import { LoadingOverlay } from '@mantine/core';
import { sortCollectionByName, uniqueItemsByKeys } from '@mokku/services';
import { useChromeStore, useChromeStoreState, useGlobalStore } from '@mokku/store';
import { IMockGroup, IMockResponse, MockType } from '@mokku/types';
import { Placeholder } from '../Blocks/Placeholder';
import { TableWrapper } from '../Blocks/Table';
import { storeActions } from '../service/storeActions';
import { useMocksTableSchema } from './useMocksTableSchema';

interface GetSchemeProps {
  toggleMock: (mock: IMockResponse) => void;
  deleteMock: (mock: IMockResponse) => void;
  editMock: (mock: IMockResponse) => void;
  duplicateMock: (mock: IMockResponse) => void;
  isActiveGroupByMock: (mock: IMockResponse) => boolean;
  getMocksByGroup: (groupId: string) => IMockResponse[];
  getMockScenarios: (mock: IMockResponse) => IMockResponse[];
  selectMockScenario: (mock: IMockResponse) => void;
  toggleGroup: (group: IMockGroup) => void;
  deleteGroup: (group: IMockGroup) => void;
  editGroup: (group: IMockGroup) => void;
}

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

  const filteredMocks = [
    ...(workspaceStore.groups || []).filter(
      (group) =>
        (group?.name || '').toLowerCase().includes(search) ||
        (group?.description || '').toLowerCase().includes(search)
    ),
    ...(workspaceStore.mocks || []).filter(
      (mock) =>
        (mock?.name || '').toLowerCase().includes(search) ||
        (mock?.url || '').toLowerCase().includes(search) ||
        (mock?.method || '').toLowerCase().includes(search) ||
        (mock?.status || '').toString().includes(search)
    )
  ];

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
