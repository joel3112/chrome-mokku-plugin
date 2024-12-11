import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { Button, Drawer, Flex, Text, createStyles } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { isJsonValid } from '@mokku/services';
import { useChromeStore, useLogStore } from '@mokku/store';
import { ActionInFormEnum, IMockGroup, IMockResponse, MockType } from '@mokku/types';
import { AddGroup } from '../Groups/AddGroup/AddGroup';
import { CloseButton } from '../Header/CloseButton';
import { LogDetails } from '../Logs/LogDetails/LogDetails';
import { getMockFromLog } from '../Logs/log.util';
import { AddMock } from '../Mocks/AddMock/AddMock';

enum ModalType {
  Group = 'GROUP',
  Mock = 'MOCK',
  Log = 'LOG'
}

const useStyles = createStyles((theme) => ({
  content: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    overflow: 'hidden auto',
    scrollBehavior: 'smooth'
  },
  header: {
    paddingBlock: 10,
    paddingInline: 16,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4]
    }`
  },
  body: {
    display: 'flex'
  },
  footer: {
    background: 'inherit',
    padding: 16,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4]
    }`,
    position: 'sticky',
    bottom: 0,
    width: '100%',
    zIndex: 1000
  }
}));

export const getActionInForm = (selected: IMockGroup | IMockResponse) => {
  if (selected.type === MockType.MOCK) {
    if (!selected.createdOn && selected.url) {
      return ActionInFormEnum.DUPLICATE;
    }
  }
  if (!selected.createdOn) {
    return ActionInFormEnum.ADD;
  }
  return ActionInFormEnum.UPDATE;
};
export const FORM_ID = 'FORM_ID';

export const Modal = () => {
  const workspaceStore = useChromeStore((state) => state.workspaceStore);
  const selectedMock = useChromeStore((state) => state.selectedMock);
  const setSelectedMock = useChromeStore((state) => state.setSelectedMock);
  const selectedGroup = useChromeStore((state) => state.selectedGroup);
  const setSelectedGroup = useChromeStore((state) => state.setSelectedGroup);
  const selectedLog = useLogStore((state) => state.selectedLog);
  const setSelectedLog = useLogStore((state) => state.setSelectedLog);
  const [order, setOrder] = useState<ModalType[]>([]);

  const [opened, { open, close }] = useDisclosure(false);
  const [title, setTitle] = React.useState('');
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
      const isNewGroup = getActionInForm(selectedGroup) !== ActionInFormEnum.UPDATE;
      setTitle(isNewGroup ? 'Add Group' : 'Update Group');
      open();
    }
    handleModalInstance(ModalType.Group, !!selectedGroup);
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedMock) {
      const isNewMock = getActionInForm(selectedMock) !== ActionInFormEnum.UPDATE;
      setTitle(isNewMock ? 'Add Mock' : 'Update Mock');
      open();
    }
    handleModalInstance(ModalType.Mock, !!selectedMock);
  }, [selectedMock]);

  useEffect(() => {
    if (selectedLog) {
      setTitle('Log Details');
      open();
    }
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
    LOG: Log
  };

  const { classes } = useStyles();

  const response = formState['response'];
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
    { color: 'red', onClick: handleClose, children: 'Close' },
    { form: FORM_ID, type: 'submit', disabled: !jsonValid, children: 'Save' }
  ];

  const logButtons = [
    {
      onClick: () => {
        close();
        setTitle('Add Mock');
        setTimeout(() => {
          setSelectedLog();
          if (selectedLog.isMocked) {
            setSelectedMock(get(workspaceStore, selectedLog.mockPath, {}));
          } else {
            setSelectedMock(getMockFromLog(selectedLog));
          }
        }, 200);
      },
      children: !selectedLog?.isMocked ? 'Add Mock' : 'Edit Mock',
      disabled: !jsonValid
    }
  ];

  return (
    <Drawer.Root
      opened={opened}
      onClose={handleClose}
      position="right"
      padding={0}
      size="auto"
      autoFocus>
      <Drawer.Overlay opacity={0.4} />
      <Drawer.Content className={classes.content}>
        <Drawer.Header className={classes.header}>
          <Drawer.Title>
            <Text size="sm">{title}</Text>
          </Drawer.Title>
          <CloseButton onClick={handleClose} />
        </Drawer.Header>

        <Drawer.Body className={classes.body}>
          {order.map((o) => (
            <Flex key={o}>{componentOrderMap[o]}</Flex>
          ))}
        </Drawer.Body>

        <Flex className={classes.footer} justify={selectedLog ? 'end' : 'space-between'}>
          {(selectedLog ? logButtons : mockButtons).map((option) => (
            <Button key={option.children} {...option} radius="md" compact />
          ))}
        </Flex>
      </Drawer.Content>
    </Drawer.Root>
  );
};
