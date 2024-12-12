import * as React from 'react';
import { Checkbox, ColorScheme, Flex, Tabs, createStyles } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { WorkspaceSettings } from '../Workspaces/WorkspaceSettings';
import { storeActions } from '../service/storeActions';
import { useChromeStore } from '../store';

const useStyles = createStyles(() => ({
  tabContainer: {
    width: 750,
    marginTop: 20,
    marginInline: 'auto'
  },
  section: {
    marginLeft: 50,
    width: 500
  }
}));

export const Settings = () => {
  const store = useChromeStore((state) => state.store);
  const setStoreProperties = useChromeStore((state) => state.setStoreProperties);

  const [colorScheme] = useLocalStorage<ColorScheme>({ key: 'color-scheme' });
  const { classes } = useStyles();

  const handleActiveScenarios = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedStore = { ...store, enabledScenarios: event.target.checked };
    storeActions.updateStoreInDB(updatedStore).then(setStoreProperties);
  };

  return (
    <>
      <Tabs defaultValue="workspace" orientation="vertical" className={classes.tabContainer}>
        <Tabs.List>
          <Tabs.Tab value="workspace">Workspace Settings</Tabs.Tab>
          <Tabs.Tab value="global">Global Settings</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="workspace" pb={16}>
          <Flex direction="column" gap={16} className={classes.section}>
            <WorkspaceSettings />
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
