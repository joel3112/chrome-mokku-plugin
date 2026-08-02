import * as React from 'react';
import { Checkbox, Flex, Tabs, createStyles } from '@mantine/core';
import { IStore } from '@mokku/types';
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

  const { classes } = useStyles();

  const handleActiveScenarios = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedStore = { ...store, enabledScenarios: event.target.checked } satisfies IStore;
    storeActions.updateStoreInDB(updatedStore).then(setStoreProperties);
  };

  const handleActiveMockConsoleLog = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedStore = { ...store, enabledMockConsoleLog: event.target.checked } satisfies IStore;
    storeActions.updateStoreInDB(updatedStore).then(setStoreProperties);
  };

  const handleActiveReloadWorkspaceChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedStore = {
      ...store,
      enabledReloadWorkspaceChanged: event.target.checked
    } satisfies IStore;
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
              checked={store.enabledScenarios}
              onChange={handleActiveScenarios}
              label="Enable scenarios"
              description={
                <>
                  Scenarios in Mokku are multiple response variants for the same URL and HTTP
                  method.
                  <br />
                  <br />
                  For example:
                  <br />
                  • Same URL: /api/users/1
                  <br />
                  • Same method: GET
                  <br />
                  • Different mocks (scenarios):
                  <br />
                  1. Success response (200)
                  <br />
                  2. Error response (404)
                  <br />
                  3. Response with simulated delay
                  <br />
                  4. Response with different data
                  <br />
                  <br />
                  <b>When scenarios are disabled</b>: Only the mock marked as active works.
                  <br />
                  <b>When scenarios are enabled</b>: You can select which variant to use (i.e.,
                  which mock should respond) from the panel dropdown. Useful for testing different
                  cases without reconfiguring mocks each time.
                </>
              }
              mb={12}
            />

            <Checkbox
              checked={store.enabledMockConsoleLog}
              onChange={handleActiveMockConsoleLog}
              label="Enable console log"
              description={
                <>
                  The mocks executed will be logged in the console.
                  <br />
                  <br />
                  The requests are <b>not visible in Network tab.</b>
                  <br />
                  If you want to see the mocked requests with their details, enable this option to
                  view them in the browser console.
                </>
              }
              mb={12}
            />

            <Checkbox
              checked={store.enabledReloadWorkspaceChanged}
              onChange={handleActiveReloadWorkspaceChanged}
              label="Enable reload on workspace change"
              description="The app will reload when the active workspace changes (creation, deletion, selection)"
              mb={12}
            />
          </Flex>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};
