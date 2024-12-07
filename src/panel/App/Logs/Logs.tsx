import React from "react";
import { Button, Code, Flex, Tooltip, useMantineTheme } from "@mantine/core";
import { get } from "lodash";
import {
  useChromeStore,
  useGlobalStore,
  useLogStore,
  useLogStoreState,
} from "@mokku/store";
import { TableSchema, TableWrapper } from "../Blocks/Table";
import { ILog } from "@mokku/types";
import { TbCpu, TbServer2 } from "react-icons/tb";
import { shallow } from "zustand/shallow";
import { getMockFromLog } from "./log.util";
import { Placeholder } from "../Blocks/Placeholder";
import { MethodTag, StatusTag } from "../Blocks/Tag";

const useLogStoreSelector = (state: useLogStoreState) => ({
  logs: state.logs,
  setSelectedLog: state.setSelectedLog,
  selectedLog: state.selectedLog,
});

export const Logs = () => {
  const {
    colors: { blue },
  } = useMantineTheme();
  const { logs, selectedLog, setSelectedLog } = useLogStore(
    useLogStoreSelector,
    shallow
  );
  const store = useChromeStore((state) => state.store);
  const search = useGlobalStore((state) => state.search).toLowerCase();

  const filteredLogs = logs.filter(
    (log) =>
      (log.request?.method || "").toLowerCase().includes(search) ||
      (log.request?.url || "").toLowerCase().includes(search) ||
      (log.response?.status || "").toString().includes(search)
  );

  const setSelectedMock = useChromeStore((state) => state.setSelectedMock);
  const schema: TableSchema<ILog> = [
    {
      header: "",
      content: (data) =>
        data.isMocked ? (
          <Tooltip label="Mocked Call">
            <span>
              <TbCpu color={blue[6]} />
            </span>
          </Tooltip>
        ) : (
          <Tooltip label="Network Call">
            <span>
              <TbServer2 />
            </span>
          </Tooltip>
        ),
      width: 40,
    },
    {
      header: "URL",
      content: (data) =>
        data.request && data.response ? (
          <Flex gap={8} align="center">
            <MethodTag method={data.request.method} />
            <StatusTag status={data.response.status} />
            <Code fz={11}>{data.request.url}</Code>
          </Flex>
        ) : (
          <></>
        ),
    },
    {
      header: "Action",
      content: (data) => (
        <Flex
          align="center"
          gap={4}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Button
            variant="light"
            radius="md"
            size="xs"
            compact
            onClick={() => {
              if (data.isMocked) {
                setSelectedMock(get(store, data.mockPath, {}));
              } else {
                setSelectedMock(getMockFromLog(data));
              }
            }}
          >
            {data.isMocked ? "Edit" : "Mock"}
          </Button>
        </Flex>
      ),
    },
  ];

  if (logs.length === 0) {
    return (
      <Placeholder
        title="No Network calls yet!"
        description="There is no network call yet, all xhr network calls will appear here."
      />
    );
  }

  if (filteredLogs.length === 0) {
    return (
      <Placeholder
        title="No matched Log."
        description="No mock is matching the current search, you can search by method, url or status."
      />
    );
  }

  return (
    <TableWrapper
      onRowClick={setSelectedLog}
      selectedRowId={selectedLog?.id}
      data={filteredLogs}
      schema={schema}
    />
  );
};
