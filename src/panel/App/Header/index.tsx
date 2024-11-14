import React, { useState } from "react";
import { shallow } from "zustand/shallow";
import { Button, Flex, Input, Tabs } from "@mantine/core";
import { MdAdd, MdClear } from "react-icons/md";
import { TbSearch } from "react-icons/tb";
import {
  useChromeStore,
  useGlobalStore,
  useGlobalStoreState,
  ViewEnum,
} from "../store";
import { ThemeButton } from "./ThemeButton";
import { RefreshButton } from "./RefreshButton";
import { ClearButton } from "./ClearButton";
import { RecordButton } from "./RecordButton";
import { SwitchButton } from "./SwitchButton";
import { SupportUs } from "./SupportUs";

const viewSelector = (state: useGlobalStoreState) => ({
  view: state.view,
  setView: state.setView,
  search: state.search,
  setSearch: state.setSearch,
});

export const Header = () => {
  const { view, setView, search, setSearch } = useGlobalStore(
    viewSelector,
    shallow
  );

  const store = useChromeStore((state) => state.store);
  const setSelectedMock = useChromeStore((state) => state.setSelectedMock);
  const setSelectedGroup = useChromeStore((state) => state.setSelectedGroup);
  const [showSupportUs, setShowSupportUs] = useState(false);

  return (
    <Tabs defaultValue={ViewEnum.MOCKS} value={view} onTabChange={setView}>
      <Tabs.List style={{ width: "100%" }}>
        <Flex justify="space-between" align="center" style={{ width: "100%" }}>
          <Flex align="center">
            <Tabs.Tab value={ViewEnum.MOCKS}>Mocks</Tabs.Tab>
            <Tabs.Tab value={ViewEnum.LOGS}>Logs</Tabs.Tab>
            <Flex align="center" gap={8}>
              <Flex align="center" gap={0}>
                <Button
                  onClick={() => setSelectedGroup({})}
                  leftIcon={<MdAdd />}
                  size="xs"
                  variant="subtle"
                >
                  Add Group
                </Button>
                <Button
                  onClick={() => setSelectedMock({})}
                  leftIcon={<MdAdd />}
                  size="xs"
                  variant="subtle"
                >
                  Add Mock
                </Button>
                <Button
                  onClick={() => store}
                  leftIcon={<MdClear />}
                  size="xs"
                  variant="subtle"
                >
                  Clear
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
              {view === "LOGS" ? <ClearButton /> : null}
            </Flex>
          </Flex>
          <Flex gap="4px" style={{ paddingRight: 4 }}>
            <Button
              onClick={() => setShowSupportUs(true)}
              size="xs"
              variant="subtle"
            >
              Support Mokku
            </Button>
            <ThemeButton />
            <RefreshButton />
            <SwitchButton />
          </Flex>
          {showSupportUs && (
            <SupportUs onClose={() => setShowSupportUs(false)} />
          )}
        </Flex>
      </Tabs.List>
    </Tabs>
  );
};
