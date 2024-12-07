import React, { forwardRef } from 'react';
import {
  MdDeleteOutline,
  MdOutlineContentCopy,
  MdOutlineExpandLess,
  MdOutlineExpandMore,
  MdOutlineModeEditOutline,
  MdOutlineMoreHoriz
} from 'react-icons/md';
import { shallow } from 'zustand/shallow';
import {
  ActionIcon,
  Code,
  Flex,
  LoadingOverlay,
  Menu,
  Select,
  Switch,
  Text,
  createStyles
} from '@mantine/core';
import { uniqueItemsByKeys } from '@mokku/services';
import { useChromeStore, useChromeStoreState, useGlobalStore } from '@mokku/store';
import { IMockGroup, IMockResponse, MockType } from '@mokku/types';
import { Placeholder } from '../Blocks/Placeholder';
import { TableSchema, TableWrapper } from '../Blocks/Table';
import { MethodTag, StatusTag } from '../Blocks/Tag';
import { useGroupActions } from '../Groups/Group.action';
import { storeActions } from '../service/storeActions';
import { useMockActions } from './Mocks.action';

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
  duplicateGroup: (group: IMockGroup) => void;
}

const useStyles = createStyles((theme) => ({
  more: {
    color: theme.colors.blue[5],
    cursor: 'pointer',
    fontSize: 20
  },
  menuOptionBlue: {
    color: theme.colors.blue[5],
    height: 28,
    fontSize: 13
  },
  menuOptionRed: {
    color: theme.colors.red[7],
    height: 28,
    fontSize: 13
  }
}));

const Name = ({ children, active }: { children: string; active: boolean }) => (
  <Text c={active ? '' : 'dimmed'} opacity={active ? 1 : 0.7} truncate>
    {children}
  </Text>
);

const getSchema = ({
  isActiveGroupByMock,
  getMocksByGroup,
  getMockScenarios,
  selectMockScenario,
  toggleMock,
  deleteMock,
  duplicateMock,
  editMock,
  toggleGroup,
  deleteGroup,
  duplicateGroup,
  editGroup
}: GetSchemeProps): TableSchema<IMockResponse | IMockGroup> => {
  const { classes } = useStyles();
  const store = useChromeStore((state) => state.store);

  return [
    {
      header: '',
      content: (data) =>
        data.type === MockType.GROUP && (
          <Flex align="center">
            {!data.expanded ? <MdOutlineExpandMore size={18} /> : <MdOutlineExpandLess size={18} />}
          </Flex>
        ),
      width: 5
    },
    {
      header: 'Name',
      content: (data) => {
        if (data.type !== MockType.GROUP) {
          const mustMockActive = (mock: IMockResponse) => mock.active && isActiveGroupByMock(mock);

          const scenarioOptions = getMockScenarios(data).map((scenario) => ({
            label: scenario.name,
            value: scenario.id,
            active: mustMockActive(scenario),
            status: scenario.status
          }));

          const scenariosSettinsEnabled = store.settings.enabledScenarios;
          if (scenarioOptions.length === 1 || !scenariosSettinsEnabled) {
            return <Name active={mustMockActive(data)}>{data.name}</Name>;
          }

          const SelectItem = forwardRef<
            HTMLDivElement,
            {
              label: string;
              status: number;
              active: boolean;
            }
          >(({ label, status, active, ...others }, ref) => (
            <div ref={ref} {...others}>
              <Flex align="center" gap={8}>
                <StatusTag status={status} />
                <Name active={active}>{label}</Name>
              </Flex>
            </div>
          ));

          return (
            <div onClick={(event) => event.stopPropagation()}>
              <Select
                variant="unstyled"
                defaultValue={data.id}
                data={scenarioOptions}
                styles={(theme) => ({
                  input: {
                    ...(!mustMockActive(data) && {
                      color: `${theme.colors.dark[2]}`,
                      opacity: 0.7
                    }),
                    textOverflow: 'ellipsis'
                  }
                })}
                itemComponent={SelectItem}
                onChange={(value) => {
                  selectMockScenario(getMockScenarios(data).find((m) => m.id === value));
                }}
              />
            </div>
          );
        }

        const totalMocksInGroup = getMocksByGroup(data.id).length;
        const activeMocksInGroup = getMocksByGroup(data.id).filter((mock) => mock.active).length;
        return (
          <Flex align="baseline" justify="space-between" gap={8}>
            <Name active={data.active}>{data.name}</Name>
            <Text
              mr={12}
              opacity={0.7}
              c="dimmed"
              size="xs">{`${activeMocksInGroup}/${totalMocksInGroup}`}</Text>
          </Flex>
        );
      },
      width: 300,
      maxWidth: 300
    },
    {
      header: '',
      content: (data) => {
        let enabled = false;
        if (data.type !== MockType.GROUP && data.groupId) {
          enabled = isActiveGroupByMock(data);
        } else {
          enabled = true;
        }

        return (
          <div
            onClick={(event) => {
              // this was not working with switch for some unknown reason
              event.stopPropagation();
            }}
            style={{ cursor: 'pointer' }}>
            <Switch
              onLabel="ON"
              offLabel="OFF"
              disabled={!enabled}
              checked={data.active}
              onChange={(x) => {
                data.type === MockType.GROUP
                  ? toggleGroup({ ...data, active: x.target.checked })
                  : toggleMock({ ...data, active: x.target.checked });
              }}
            />
          </div>
        );
      },
      width: 60
    },
    {
      header: 'URL',
      content: (data) => (data.type !== MockType.GROUP ? <Code fz={11}>{data.url}</Code> : ''),
      minWidth: 130
    },
    {
      header: <Flex justify="end">Status</Flex>,
      content: (data) =>
        data.type !== MockType.GROUP && (
          <Flex gap={8} justify="end">
            <MethodTag method={data.method} />
            <StatusTag status={data.status} />
          </Flex>
        ),
      width: 30
    },
    {
      header: '',
      content: (data) => (
        <div onClick={(event) => event.stopPropagation()}>
          <Menu position="bottom-end" offset={-8}>
            <Menu.Target>
              <ActionIcon
                variant="transparent"
                size="lg"
                style={{
                  height: '100%',
                  minHeight: 32
                }}>
                <MdOutlineMoreHoriz className={classes.more} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                className={classes.menuOptionBlue}
                icon={<MdOutlineModeEditOutline />}
                onClick={() => (data.type === MockType.GROUP ? editGroup(data) : editMock(data))}>
                Edit
              </Menu.Item>
              {data.type === MockType.MOCK && (
                <Menu.Item
                  className={classes.menuOptionBlue}
                  icon={<MdOutlineContentCopy />}
                  onClick={() => duplicateMock(data)}>
                  Duplicate
                </Menu.Item>
              )}
              <Menu.Item
                className={classes.menuOptionRed}
                icon={<MdDeleteOutline />}
                onClick={() =>
                  data.type === MockType.GROUP ? deleteGroup(data) : deleteMock(data)
                }>
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ),
      width: 50
    }
  ];
};

const useMockStoreSelector = (state: useChromeStoreState) => ({
  store: state.store,
  setSelectedGroup: state.setSelectedGroup,
  selectedGroup: state.selectedGroup,
  setSelectedMock: state.setSelectedMock,
  selectedMock: state.selectedMock,
  setStoreProperties: state.setStoreProperties
});

export const Mocks = () => {
  const {
    store,
    selectedMock,
    setSelectedMock,
    selectedGroup,
    setSelectedGroup,
    setStoreProperties
  } = useChromeStore(useMockStoreSelector, shallow);
  const search = useGlobalStore((state) => state.search).toLowerCase();

  const {
    isActiveGroupByMock,
    getMocksByGroup,
    getMockScenarios,
    selectMockScenario,
    deleteMock,
    duplicateMock,
    toggleMock,
    editMock
  } = useMockActions();
  const { deleteGroup, duplicateGroup, toggleGroup, editGroup } = useGroupActions();

  const schema = getSchema({
    isActiveGroupByMock,
    getMocksByGroup,
    getMockScenarios,
    selectMockScenario,
    toggleMock,
    deleteMock,
    duplicateMock,
    editMock,
    toggleGroup,
    deleteGroup,
    duplicateGroup,
    editGroup
  });

  const filteredMocks = [
    ...(store.groups || []).filter(
      (group) =>
        (group?.name || '').toLowerCase().includes(search) ||
        (group?.description || '').toLowerCase().includes(search)
    ),
    ...(store.mocks || []).filter(
      (mock) =>
        (mock?.name || '').toLowerCase().includes(search) ||
        (mock?.url || '').toLowerCase().includes(search) ||
        (mock?.method || '').toLowerCase().includes(search) ||
        (mock?.status || '').toString().includes(search)
    )
  ];

  console.log('filteredMocks', filteredMocks);

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

    const uniqueMocks = store.settings.enabledScenarios
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
    [...groups, ...uniqueMocks]
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((item) => {
        if (item.type === 'group') {
          result.push(item);
          // Add mocks associated with this group
          if (groupedMocks[item.id]) {
            result.push(...groupedMocks[item.id].sort((a, b) => a.name.localeCompare(b.name)));
          }
        } else if (item.type === 'mock' && !item.groupId) {
          result.push(item);
        }
      });

    return result;
  }

  console.log('organizeItems', organizeItems(filteredMocks));

  if (!store.mocks || !store.groups) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  if (store.mocks.length === 0 && store.groups.length === 0) {
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
      const updatedStore = storeActions.updateGroups(store, {
        ...data,
        expanded: !data.expanded
      });
      storeActions.updateStoreInDB(updatedStore).then(setStoreProperties);
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
