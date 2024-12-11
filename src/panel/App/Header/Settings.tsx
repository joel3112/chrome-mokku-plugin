import * as React from 'react';
import { Center, Checkbox, ColorScheme, Flex, Tabs, Title, createStyles } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { storeActions } from '../service/storeActions';
import { StoreProperties, useChromeStore } from '../store';
import { WorkspaceSettings } from './WorkspaceSettings';

const useStyles = createStyles(() => ({
  tabContainer: {
    width: 750,
    marginInline: 'auto'
  },
  section: {
    marginLeft: 50,
    width: 500
  }
}));

export const Settings = ({ onClose }: { onClose: () => void }) => {
  const store = useChromeStore((state) => state.store);
  const setStoreProperties = useChromeStore((state) => state.setStoreProperties);

  const [colorScheme] = useLocalStorage<ColorScheme>({ key: 'color-scheme' });
  const { classes } = useStyles();

  const updateUI = (res: StoreProperties) => {
    setStoreProperties(res);
    onClose();
  };

  const handleActiveScenarios = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedStore = { ...store, enabledScenarios: event.target.checked };
    storeActions.updateStoreInDB(updatedStore).then(updateUI);
  };

  return (
    <>
      <Center mb={30}>
        <Title order={4}>Settings</Title>
      </Center>

      <Tabs defaultValue="workspace" orientation="vertical" className={classes.tabContainer}>
        <Tabs.List>
          <Tabs.Tab value="workspace">Workspace Settings</Tabs.Tab>
          <Tabs.Tab value="global">Global Settings</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="workspace" pb={16}>
          <Flex direction="column" gap={16} className={classes.section}>
            <WorkspaceSettings onClose={onClose} />
          </Flex>
        </Tabs.Panel>
        <Tabs.Panel value="global" pb={16}>
          <Flex direction="column" gap={16} className={classes.section}>
            <Checkbox
              defaultChecked={store.enabledScenarios}
              onChange={handleActiveScenarios}
              label="Enable scenarios"
              description="The mocks with same URL and method will be grouped together"
              mb={12}
            />
          </Flex>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};
