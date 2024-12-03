import React, { useEffect, useState } from "react";
import { useChromeStore, useLogStore } from "../store";
import { AddGroup } from "../Groups/AddGroup/AddGroup";
import { AddMock } from "../Mocks/AddMock/AddMock";
import { LogDetails } from "../Logs/LogDetails/LogDetails";
import { Button, createStyles, Drawer, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ActionInFormEnum, IMockGroup, IMockResponse } from "../types/mock";
import { isJsonValid } from "../Mocks/AddMock/utils";
import { getMockFromLog } from "../Logs/log.util";

enum ModalType {
  Group = "GROUP",
  Mock = "MOCK",
  Log = "LOG",
}

const useStyles = createStyles((theme) => ({
  header: {
    padding: 12,
    borderLeft: `2px solid ${theme.colors.gray[5]}`,
  },
  body: {
    display: "flex",
  },
  footer: {
    background: "inherit",
    padding: 16,
    borderLeft: `2px solid ${theme.colors.gray[5]}`,
    position: "sticky",
    bottom: 0,
    width: "100%",
    zIndex: 1000,
  },
}));

export const getActionInForm = (selected: IMockGroup | IMockResponse) => {
  if (!selected.createdOn && selected.name) {
    return ActionInFormEnum.DUPLICATE;
  }
  if (!selected.createdOn) {
    return ActionInFormEnum.ADD;
  }
  return ActionInFormEnum.UPDATE;
};
export const FORM_ID = "FORM_ID";

export const Modal = () => {
  const selectedMock = useChromeStore((state) => state.selectedMock);
  const setSelectedMock = useChromeStore((state) => state.setSelectedMock);
  const selectedGroup = useChromeStore((state) => state.selectedGroup);
  const setSelectedGroup = useChromeStore((state) => state.setSelectedGroup);
  const selectedLog = useLogStore((state) => state.selectedLog);
  const setSelectedLog = useLogStore((state) => state.setSelectedLog);
  const [order, setOrder] = useState<ModalType[]>([]);

  const [opened, { open, close }] = useDisclosure(false);
  const [title, setTitle] = React.useState("");
  const [formState, setFormState] = React.useState({});

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

      const isNewGroup =
        getActionInForm(selectedGroup) !== ActionInFormEnum.UPDATE;
      setTitle(isNewGroup ? "Add Group" : "Update Group");
      selectedGroup && open();
    }
    handleModalInstance(ModalType.Group, !!selectedGroup);
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedMock) {
      setSelectedGroup();

      const isNewMock =
        getActionInForm(selectedMock) !== ActionInFormEnum.UPDATE;
      setTitle(isNewMock ? "Add Mock" : "Update Mock");
      selectedMock && open();
    }
    handleModalInstance(ModalType.Mock, !!selectedMock);
  }, [selectedMock]);

  useEffect(() => {
    selectedLog && open();
    setTitle("Log Details");
    handleModalInstance(ModalType.Log, !!selectedLog);
  }, [selectedLog]);

  const Mock = selectedMock ? (
    <AddMock
      onFormChange={(values) => setFormState(values)}
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

  const { classes } = useStyles();

  const response = formState["response"];
  const jsonValid = response ? isJsonValid(response) : true;

  const handleClose = () => {
    close();

    setTimeout(() => {
      setSelectedMock();
      setSelectedGroup();
      setSelectedLog();
    }, 200);
  };

  const mockButtons = [
    { color: "red", onClick: handleClose, children: "Close" },
    { form: FORM_ID, type: "submit", disabled: !jsonValid, children: "Save" },
  ];

  const logButtons = [
    {
      onClick: () => {
        close();
        setTimeout(() => {
          setSelectedLog();
          setTitle("Add Mock");
          setSelectedMock(getMockFromLog(selectedLog));
        }, 200);
      },
      children: "Add Mock",
      disabled: !jsonValid,
    },
  ];

  return (
    <Drawer.Root
      opened={opened}
      onClose={handleClose}
      position="right"
      padding={0}
      size="auto"
      autoFocus
    >
      <Drawer.Overlay opacity={0.1} />
      <Drawer.Content display="grid" style={{ gridTemplateRows: "auto 1fr" }}>
        <Drawer.Header className={classes.header}>
          <Drawer.Title>{title}</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>

        <Drawer.Body className={classes.body}>
          {order.map((o) => (
            <Flex key={o}>{componentOrderMap[o]}</Flex>
          ))}
        </Drawer.Body>

        <Flex
          className={classes.footer}
          justify={selectedLog ? "end" : "space-between"}
        >
          {(selectedLog ? logButtons : mockButtons).map((option) => (
            <Button key={option.children} {...option} radius="md" compact />
          ))}
        </Flex>
      </Drawer.Content>
    </Drawer.Root>
  );
};
