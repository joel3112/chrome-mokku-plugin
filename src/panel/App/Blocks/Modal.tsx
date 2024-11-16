import React, { useEffect, useState } from "react";
import { useChromeStore, useLogStore } from "../store";
import { AddGroup } from "../Groups/AddGroup/AddGroup";
import { AddMock } from "../Mocks/AddMock/AddMock";
import { LogDetails } from "../Logs/LogDetails/LogDetails";
import { Drawer, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

enum ModalType {
  Group = "GROUP",
  Mock = "MOCK",
  Log = "LOG",
}

export const Modal = () => {
  const selectedMock = useChromeStore((state) => state.selectedMock);
  const setSelectedMock = useChromeStore((state) => state.setSelectedMock);
  const selectedGroup = useChromeStore((state) => state.selectedGroup);
  const setSelectedGroup = useChromeStore((state) => state.setSelectedGroup);
  const selectedLog = useLogStore((state) => state.selectedLog);
  const setSelectedLog = useLogStore((state) => state.setSelectedLog);
  const [order, setOrder] = useState<ModalType[]>([]);

  const [opened, { open, close }] = useDisclosure(false);

  const handleModalInstance = (modalType: ModalType, condition: boolean) => {
    setOrder((order) => {
      if (condition) {
        if (order.includes(modalType)) {
          return [...order];
        } else {
          return [modalType, ...order];
        }
      } else {
        return order.filter((o) => o !== modalType);
      }
    });
  };

  useEffect(() => {
    if (selectedGroup) {
      setSelectedMock();
      selectedGroup && open();
    }
    handleModalInstance(ModalType.Group, !!selectedGroup);
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedMock) {
      setSelectedGroup();
      selectedMock && open();
    }
    handleModalInstance(ModalType.Mock, !!selectedMock);
  }, [selectedMock]);

  useEffect(() => {
    selectedLog && open();
    handleModalInstance(ModalType.Log, !!selectedLog);
  }, [selectedLog]);

  const Mock = selectedMock ? (
    <AddMock
      onClose={() => {
        close();
        setSelectedMock();
      }}
    />
  ) : null;
  const Group = selectedGroup ? (
    <AddGroup
      onClose={() => {
        close();
        setSelectedGroup();
      }}
    />
  ) : null;
  const Log = selectedLog ? (
    <LogDetails
      log={selectedLog}
      onClose={() => {
        close();
        setSelectedLog();
      }}
    />
  ) : null;

  const componentOrderMap = {
    MOCK: Mock,
    GROUP: Group,
    LOG: Log,
  };

  return (
    <Drawer.Root
      opened={opened}
      onClose={() => {
        close();

        setTimeout(() => {
          setSelectedMock();
          setSelectedGroup();
          setSelectedLog();
        }, 300);
      }}
      position="right"
      padding={0}
      size="auto"
      autoFocus
    >
      <Drawer.Overlay opacity={0.1} />
      <Drawer.Content>
        <Drawer.Body display="flex" style={{ height: "100%" }}>
          {order.map((o) => (
            <Flex key={o}>{componentOrderMap[o]}</Flex>
          ))}
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};
