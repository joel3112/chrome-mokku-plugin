import React, { forwardRef } from 'react';
import {
  MdDeleteOutline,
  MdOutlineContentCopy,
  MdOutlineExpandLess,
  MdOutlineExpandMore,
  MdOutlineModeEditOutline,
  MdOutlineMoreHoriz
} from 'react-icons/md';
import { ActionIcon, Code, Flex, Menu, Select, Switch, Text, createStyles } from '@mantine/core';
import { useChromeStore } from '@mokku/store';
import { IMockGroup, IMockResponse, MockType } from '@mokku/types';
import { TableSchema } from '../Blocks/Table';
import { MethodTag, StatusTag } from '../Blocks/Tag';
import { useGroupActions } from '../Groups/Group.action';
import { useMockActions } from './Mocks.action';

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

const ScenariosSelector = ({ scenarios }: { scenarios: IMockResponse[] }) => {
  const { isActiveGroupByMock, selectMockScenario } = useMockActions();

  const mustMockActive = (mock: IMockResponse) => mock.active && isActiveGroupByMock(mock);
  const scenarioSelected = scenarios.find((m) => m.selected) || scenarios[0];
  const scenarioOptions = scenarios.map((scenario) => ({
    label: scenario.name,
    value: scenario.id,
    active: mustMockActive(scenario),
    status: scenario.status
  }));

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <Select
        variant="unstyled"
        value={scenarioSelected?.id}
        data={scenarioOptions}
        styles={(theme) => ({
          input: {
            ...(!mustMockActive(scenarioSelected) && {
              color: `${theme.colors.dark[2]}`,
              opacity: 0.7
            }),
            textOverflow: 'ellipsis'
          }
        })}
        itemComponent={SelectItem}
        onChange={(value) => {
          selectMockScenario(scenarios.find((m) => m.id === value));
        }}
      />
    </div>
  );
};

export const useMocksTableSchema = (): TableSchema<IMockResponse | IMockGroup> => {
  const {
    isActiveGroupByMock,
    getMocksByGroup,
    getMockScenarios,
    deleteMock,
    duplicateMock,
    toggleMock,
    editMock
  } = useMockActions();
  const { deleteGroup, toggleGroup, editGroup } = useGroupActions();

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
          const scenarios = getMockScenarios(data);

          const scenariosSettinsEnabled = store.enabledScenarios;
          if (scenarios.length === 1 || !scenariosSettinsEnabled) {
            return <Name active={mustMockActive(data)}>{data.name}</Name>;
          }

          return <ScenariosSelector scenarios={scenarios} />;
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
