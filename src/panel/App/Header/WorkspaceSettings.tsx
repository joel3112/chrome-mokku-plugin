import * as React from 'react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { TbDownload, TbTrash, TbUpload } from 'react-icons/tb';
import {
  Box,
  Button,
  type ButtonProps,
  Divider,
  FileButton,
  Flex,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { downloadJsonFile, extractJsonFromFile } from '@mokku/services';
import { StoreProperties, useChromeStore } from '@mokku/store';
import { storeActions } from '../service/storeActions';
import { useWorkspaceActions } from './Workspace.action';

const SettingsButton = (
  props: Omit<ButtonProps, 'size' | 'variant' | 'radius' | 'style'> & {
    children: ReactNode;
    onClick: () => void;
  }
) => <Button size="xs" variant="outline" {...props} />;

export const WorkspaceSettings = ({ onClose }: { onClose: () => void }) => {
  const store = useChromeStore((state) => state.store);
  const workspaceStore = useChromeStore((state) => state.workspaceStore);
  const selectedWorkspace = useChromeStore((state) => state.selectedWorkspace);
  const setStoreProperties = useChromeStore((state) => state.setStoreProperties);

  const { changeNameWorkspace, resetWorkspace, deleteWorkspace } = useWorkspaceActions();

  const [newName, setNewName] = React.useState(selectedWorkspace.name ?? '');
  const [file, setFile] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);

  useEffect(() => {
    if (file) {
      handleImportData();
    }
  }, [file]);

  const updateUI = (res: StoreProperties) => {
    setStoreProperties(res);
    onClose();
  };

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

  return (
    <>
      <form
        style={{ width: 280 }}
        onSubmit={(e) => {
          e.preventDefault();
          const name = e.target['name'].value;
          changeNameWorkspace(selectedWorkspace, name).then(onClose);
        }}>
        <TextInput
          required
          name="name"
          label="Workspace name"
          placeholder="My workspace"
          defaultValue={selectedWorkspace.name}
          onChange={(e) => setNewName(e.currentTarget.value)}
        />
        <Button type="submit" compact mt={8} disabled={newName === selectedWorkspace.name}>
          Save changes
        </Button>
      </form>

      <Box mt={4} mb={8}>
        <Title order={6}>Delete workspace</Title>
        <Button
          type="submit"
          variant="outline"
          compact
          color="red"
          mt={8}
          onClick={() => deleteWorkspace(selectedWorkspace, onClose)}>
          Delete entire workspace
        </Button>
      </Box>

      <Divider />

      <Box mt={8}>
        <Title order={6}>Manage workspace data</Title>
        <Text size="xs">
          You can import and export your data (mocks and groups) in JSON format and clear all the
          data in the workspace.
        </Text>
        <Flex gap={8} mt={12}>
          <FileButton onChange={setFile} resetRef={resetRef} accept="application/json">
            {(props) => (
              <SettingsButton leftIcon={<TbUpload />} {...props}>
                Import JSON
              </SettingsButton>
            )}
          </FileButton>
          <SettingsButton leftIcon={<TbDownload />} onClick={handleExportData}>
            Export JSON
          </SettingsButton>
          <SettingsButton
            color="red"
            leftIcon={<TbTrash />}
            onClick={() => resetWorkspace(selectedWorkspace, onClose)}>
            Clear data
          </SettingsButton>
        </Flex>
      </Box>
    </>
  );
};
