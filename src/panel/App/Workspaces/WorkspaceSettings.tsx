import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { TbDownload, TbTrash, TbUpload } from 'react-icons/tb';
import { Box, Button, Divider, FileButton, Flex, Text, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { downloadJsonFile, extractJsonFromFile } from '@mokku/services';
import { useChromeStore } from '@mokku/store';
import { SettingsButton } from '../Header/SettingsButton';
import { storeActions } from '../service/storeActions';
import { useWorkspaceActions } from './Workspace.action';

export const WorkspaceSettings = () => {
  const workspaceStore = useChromeStore((state) => state.workspaceStore);
  const selectedWorkspace = useChromeStore((state) => state.selectedWorkspace);
  const setStoreProperties = useChromeStore((state) => state.setStoreProperties);

  const { changeNameWorkspace, resetWorkspace, deleteWorkspace } = useWorkspaceActions();

  const [newName, setNewName] = useState(selectedWorkspace.name ?? '');
  const [file, setFile] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);

  useEffect(() => {
    if (newName !== selectedWorkspace.name) {
      setNewName(selectedWorkspace.name);
    }
  }, [selectedWorkspace.name]);

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
          .then(setStoreProperties);
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
        key={selectedWorkspace.id}
        style={{ width: 280 }}
        onSubmit={(e) => {
          e.preventDefault();
          const name = e.target['name'].value;
          changeNameWorkspace(selectedWorkspace, name);
        }}>
        <TextInput
          required
          data-autofocus
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
          onClick={() => deleteWorkspace(selectedWorkspace)}>
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
              <SettingsButton variant="outline" Icon={TbUpload} {...props}>
                Import JSON
              </SettingsButton>
            )}
          </FileButton>
          <SettingsButton variant="outline" Icon={TbDownload} onClick={handleExportData}>
            Export JSON
          </SettingsButton>
          <SettingsButton
            color="red"
            variant="outline"
            Icon={TbTrash}
            onClick={() => resetWorkspace(selectedWorkspace)}>
            Clear data
          </SettingsButton>
        </Flex>
      </Box>
    </>
  );
};
