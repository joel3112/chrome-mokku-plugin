import React from "react";
import { ActionIcon, Flex, Switch, Text } from "@mantine/core";
import { TableSchema, TableWrapper } from "../Blocks/Table";
import { IMockGroup, IMockResponse, MockType } from "../types";
import { useChromeStore, useChromeStoreState, useGlobalStore } from "../store";
import { shallow } from "zustand/shallow";
import {
  MdDeleteOutline,
  MdOutlineContentCopy,
  MdOutlineExpandLess,
  MdOutlineExpandMore,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import { useMockActions } from "./Mocks.action";
import { Placeholder } from "../Blocks/Placeholder";
import { useGroupActions } from "../Groups/Group.action";
import { storeActions } from "../service/storeActions";

interface GetSchemeProps {
  toggleMock: (mock: IMockResponse) => void;
  deleteMock: (mock: IMockResponse) => void;
  editMock: (mock: IMockResponse) => void;
  duplicateMock: (mock: IMockResponse) => void;

  getMocksByGroup: (groupId: string) => IMockResponse[];
  toggleGroup: (group: IMockGroup) => void;
  deleteGroup: (group: IMockGroup) => void;
  editGroup: (group: IMockGroup) => void;
  duplicateGroup: (group: IMockGroup) => void;
}

const getSchema = ({
  getMocksByGroup,
  toggleMock,
  deleteMock,
  duplicateMock,
  editMock,
  toggleGroup,
  deleteGroup,
  duplicateGroup,
  editGroup,
}: GetSchemeProps): TableSchema<IMockResponse | IMockGroup> => [
  {
    header: "",
    content: (data) => (
      <div
        onClick={(event) => {
          // this was not working with switch for some unknown reason
          event.stopPropagation();
        }}
        style={{ cursor: "pointer" }}
      >
        <Switch
          checked={data.active}
          onChange={(x) => {
            data.type === MockType.GROUP
              ? toggleGroup({ ...data, active: x.target.checked })
              : toggleMock({ ...data, active: x.target.checked });
          }}
        />
      </div>
    ),
    width: 60,
  },
  {
    header: "",
    content: (data) =>
      data.type === MockType.GROUP && (
        <Flex align="center">
          {!data.expanded ? (
            <MdOutlineExpandMore size={18} />
          ) : (
            <MdOutlineExpandLess size={18} />
          )}
        </Flex>
      ),
    width: 5,
  },
  {
    header: "Name",
    content: (data) => {
      if (data.type !== MockType.GROUP) {
        return data.name;
      }

      // return `${data.name} (${getMocksByGroup(data.id).length})`;
      const totalMocksInGroup = getMocksByGroup(data.id).length;
      const activeMocksInGroup = getMocksByGroup(data.id).filter(
        (mock) => mock.active
      ).length;
      return (
        <Flex align="center" gap={8}>
          <Text>{data.name}</Text>
          <Text
            opacity={0.7}
            c="dimmed"
            size="xs"
          >{`(${activeMocksInGroup}/${totalMocksInGroup})`}</Text>
        </Flex>
      );
    },
    width: 240,
  },
  {
    header: "Method",
    content: (data) => (data.type !== MockType.GROUP ? data.method : ""),
    width: 100,
  },
  {
    header: "URL",
    content: (data) => (data.type !== MockType.GROUP ? data.url : ""),
  },
  {
    header: "Status",
    content: (data) => (data.type !== MockType.GROUP ? data.status : ""),
    width: 80,
  },
  {
    header: "Delay",
    content: (data) => (data.type !== MockType.GROUP ? data.delay : ""),
    width: 120,
  },
  {
    header: "",
    content: (data) => (
      <Flex
        align="center"
        gap="4px"
        onClick={(event) => {
          // this was not working with switch for some unknown reason
          event.stopPropagation();
        }}
      >
        <ActionIcon
          variant="outline"
          color="blue"
          onClick={() =>
            data.type === MockType.GROUP ? editGroup(data) : editMock(data)
          }
          title={`Edit Mock ${data.name}`}
        >
          <MdOutlineModeEditOutline />
        </ActionIcon>

        <ActionIcon
          variant="outline"
          color="blue"
          onClick={() =>
            data.type === MockType.GROUP
              ? duplicateGroup(data)
              : duplicateMock(data)
          }
          title={`Duplicate ${data.name}`}
        >
          <MdOutlineContentCopy />
        </ActionIcon>
        <ActionIcon
          variant="outline"
          color="red"
          onClick={() =>
            data.type === MockType.GROUP ? deleteGroup(data) : deleteMock(data)
          }
          title={`Delete ${data.name}`}
        >
          <MdDeleteOutline />
        </ActionIcon>
      </Flex>
    ),
    width: 80,
  },
];

const useMockStoreSelector = (state: useChromeStoreState) => ({
  store: state.store,
  setSelectedGroup: state.setSelectedGroup,
  selectedGroup: state.selectedGroup,
  setSelectedMock: state.setSelectedMock,
  selectedMock: state.selectedMock,
  setStoreProperties: state.setStoreProperties,
});

export const Mocks = () => {
  const {
    store,
    selectedMock,
    setSelectedMock,
    selectedGroup,
    setSelectedGroup,
    setStoreProperties,
  } = useChromeStore(useMockStoreSelector, shallow);
  const search = useGlobalStore((state) => state.search).toLowerCase();

  const {
    getMocksByGroup,
    deleteMock,
    duplicateMock,
    toggleMock,
    editMock,
  } = useMockActions();
  const {
    deleteGroup,
    duplicateGroup,
    toggleGroup,
    editGroup,
  } = useGroupActions();

  const schema = getSchema({
    getMocksByGroup,
    toggleMock,
    deleteMock,
    duplicateMock,
    editMock,
    toggleGroup,
    deleteGroup,
    duplicateGroup,
    editGroup,
  });

  const filteredMocks = [
    ...store.groups.filter(
      (group) =>
        (group?.name || "").toLowerCase().includes(search) ||
        (group?.description || "").toLowerCase().includes(search)
    ),
    ...store.mocks.filter(
      (mock) =>
        (mock?.name || "").toLowerCase().includes(search) ||
        (mock?.url || "").toLowerCase().includes(search) ||
        (mock?.method || "").toLowerCase().includes(search) ||
        (mock?.status || "").toString().includes(search)
    ),
  ].sort((a, b) => a.name.localeCompare(b.name));

  console.log("filteredMocks", filteredMocks);

  function organizeItems(
    items: (IMockResponse | IMockGroup)[]
  ): (IMockResponse | IMockGroup)[] {
    // Separate items into groups and mocks
    const groups = [];
    const mocks = [];

    items.forEach((item) => {
      if (item.type === "group") {
        groups.push(item);
      } else if (item.type === "mock") {
        mocks.push(item);
      }
    });

    // Map group IDs to their respective mocks
    const groupedMocks = {};
    mocks.forEach((mock) => {
      if (mock.groupId) {
        if (!groupedMocks[mock.groupId]) {
          groupedMocks[mock.groupId] = [];
        }
        groupedMocks[mock.groupId].push(mock);
      }
    });

    // Reconstruct the ordered array
    const result = [];
    items.forEach((item) => {
      if (item.type === "group") {
        result.push(item);
        // Add mocks associated with this group
        if (groupedMocks[item.id]) {
          result.push(...groupedMocks[item.id]);
        }
      } else if (item.type === "mock" && !item.groupId) {
        result.push(item);
      }
    });

    return result;
  }

  console.log("organizeItems", organizeItems(filteredMocks));

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
        expanded: !data.expanded,
      });
      storeActions.updateStoreInDB(updatedStore).then(setStoreProperties);
      return;
    }
    setSelectedMock(data);
  };

  return (
    <TableWrapper
      onRowClick={selectRow}
      selectedRowId={selectedMock?.id}
      data={organizeItems(filteredMocks)}
      schema={schema}
    />
  );
};
