import * as React from 'react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { BsPaypal } from 'react-icons/bs';
import { CiExport, CiImport, CiTrash } from 'react-icons/ci';
import { MdClose } from 'react-icons/md';
import { RiChromeFill } from 'react-icons/ri';
import { SiBuymeacoffee } from 'react-icons/si';
import {
  ActionIcon,
  Button,
  type ButtonProps,
  Card,
  Center,
  Checkbox,
  ColorScheme,
  FileButton,
  Flex,
  Text,
  Title,
  createStyles
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { downloadJsonFile, extractJsonFromFile } from '@mokku/services';
import { storeActions } from '../service/storeActions';
import { StoreProperties, useChromeStore } from '../store';

const useStyles = createStyles(() => ({
  wrapper: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto'
  }
}));

const SettingsButton = (
  props: Omit<ButtonProps, 'size' | 'variant' | 'radius' | 'style'> & {
    children: ReactNode;
    onClick: () => void;
  }
) => (
  <Button
    size="xs"
    variant="outline"
    radius="md"
    style={{ width: 240, marginBottom: 12 }}
    {...props}
  />
);

export const Settings = ({ onClose }: { onClose: () => void }) => {
  const store = useChromeStore((state) => state.store);
  const workspaceStore = useChromeStore((state) => state.workspaceStore);
  const selectedWorkspace = useChromeStore((state) => state.selectedWorkspace);
  const setStoreProperties = useChromeStore((state) => state.setStoreProperties);

  const [colorScheme] = useLocalStorage<ColorScheme>({ key: 'color-scheme' });
  const { classes } = useStyles();

  const [file, setFile] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);

  const updateUI = (res: StoreProperties) => {
    setStoreProperties(res);
    onClose();
  };

  useEffect(() => {
    if (file) {
      handleImportData();
    }
  }, [file]);

  const handleImportData = () => {
    extractJsonFromFile(file)
      .then((jsonData) => {
        const updatedWorkspaceStore = { ...workspaceStore, ...jsonData };
        storeActions
          .updateWorkspaceStoreInDB(selectedWorkspace.id, updatedWorkspaceStore)
          .then(updateUI);
        notifications.show({
          title: `Import data`,
          message: `Data imported successfully`
        });
      })
      .catch((error) => {
        console.error('Failed to import data:', error);
        notifications.show({
          id: 'import-data-error',
          title: `Import data`,
          message: `Failed to import data`,
          color: 'red'
        });
      })
      .finally(() => {
        setFile(null);
        resetRef.current?.();
      });
  };

  const handleExportData = () => {
    downloadJsonFile(workspaceStore);
    notifications.show({
      title: `Export data`,
      message: `Data exported successfully, check your downloads`
    });
  };

  const handleClearData = () =>
    modals.openConfirmModal({
      title: 'Clear data',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to remove your data? This action is destructive and you will lose
          all your data for the workspace <b>{selectedWorkspace.name}</b>.
        </Text>
      ),
      labels: { confirm: 'Clear', cancel: "No don't clear it" },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        storeActions.resetWorkspaceStore(selectedWorkspace.id).then(updateUI);
        notifications.show({
          title: `Clear data`,
          message: `All data cleared successfully`
        });
      }
    });

  const handleActiveScenarios = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedStore = { ...store, enabledScenarios: event.target.checked };
    storeActions.updateStoreInDB(updatedStore).then(updateUI);
  };

  return (
    <Card className={classes.wrapper}>
      <Flex direction="row-reverse">
        <ActionIcon
          variant="outline"
          color={'blue'}
          onClick={() => onClose()}
          title="Toggle Theme"
          radius="md">
          <MdClose />
        </ActionIcon>
      </Flex>
      <Flex direction="column" align="center" gap={100}>
        <Flex direction="column" gap={16}>
          <Center>
            <Title order={4}>Settings</Title>
          </Center>
          <Checkbox
            defaultChecked={store.enabledScenarios}
            onChange={handleActiveScenarios}
            label="Enable scenarios"
            description="The mocks with same URL and method will be grouped together"
            mb={12}
          />
          <Text style={{ maxWidth: 480 }} fz="sm">
            You can import and export your data, change the theme, and clear all.
          </Text>
          <Flex direction="column">
            <Flex gap="8px">
              <FileButton onChange={setFile} resetRef={resetRef} accept="application/json">
                {(props) => (
                  <SettingsButton leftIcon={<CiImport />} {...props}>
                    Import JSON
                  </SettingsButton>
                )}
              </FileButton>
              <SettingsButton leftIcon={<CiExport />} onClick={handleExportData}>
                Export JSON
              </SettingsButton>
            </Flex>
            <Flex gap="8px">
              <SettingsButton color="red" leftIcon={<CiTrash />} onClick={handleClearData}>
                Clear data
              </SettingsButton>
            </Flex>
          </Flex>
        </Flex>

        <Flex direction="column" gap={16}>
          <Center>
            <Title order={4}>Support the Mokku's Development</Title>
          </Center>
          <Text style={{ maxWidth: 480 }} fz="sm">
            Hi there 👋, I am an Indie developer, who works in his spare time to develop Mokku and
            help other developers around the world, your support is highly appreciated to keep the
            project alive.
          </Text>
          <Flex direction="column">
            <Flex gap={8}>
              <SettingsButton
                leftIcon={<BsPaypal />}
                onClick={() =>
                  chrome.tabs.create({
                    url: 'https://paypal.me/mukuljainx?country.x=IN&locale.x=en_GB'
                  })
                }>
                Paypal Me
              </SettingsButton>
              <SettingsButton
                color="orange"
                leftIcon={<SiBuymeacoffee />}
                onClick={() =>
                  chrome.tabs.create({
                    url: 'https://www.buymeacoffee.com/mukuljainx'
                  })
                }>
                Buy me a Coffee
              </SettingsButton>
            </Flex>
            <Flex gap={8}>
              <SettingsButton
                color={colorScheme === 'dark' ? 'gray' : 'dark'}
                leftIcon={<AiFillGithub />}
                onClick={() =>
                  chrome.tabs.create({
                    url: 'https://github.com/mukuljainx/mokku-bug-trakcer/issues'
                  })
                }>
                Raise Issue on Github
              </SettingsButton>
              <SettingsButton
                color="indigo"
                leftIcon={<RiChromeFill />}
                onClick={() =>
                  chrome.tabs.create({
                    url: 'https://chrome.google.com/webstore/detail/mokku/llflfcikklhgamfmnjkgpdadpmdplmji'
                  })
                }>
                Review on Chrome Store
              </SettingsButton>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
