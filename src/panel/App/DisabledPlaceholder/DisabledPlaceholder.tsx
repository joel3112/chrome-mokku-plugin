import React from 'react';
import { FaPowerOff } from 'react-icons/fa6';
import { Button, Flex, Highlight, Paper, Title, createStyles } from '@mantine/core';
import { useGlobalStore } from '@mokku/store';
import { storeActions } from '../service/storeActions';

export const usePaperStyles = createStyles((theme) => ({
  full: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

export const DisabledPlaceholder = () => {
  const active = useGlobalStore((state) => state.meta.active);
  const host = useGlobalStore((state) => state.meta.host);
  const tab = useGlobalStore((state) => state.meta.tab);

  const { classes } = usePaperStyles();
  const onClick = () => {
    storeActions.setHostActive(host, !active).then(() => {
      chrome.tabs.update(tab.id, { url: tab.url });
      location.reload();
    });
  };

  return (
    <Paper className={classes.full}>
      <Flex direction="row" gap={16}>
        <FaPowerOff size={60} />
        <Flex direction="column" gap={8}>
          <Title order={4}>Mocking is disabled by default on non-localhost urls.</Title>
          <Highlight highlight="refresh the current page">
            Enabling will refresh the current page.
          </Highlight>
          <Button onClick={onClick} mt={16} style={{ alignSelf: 'flex-start' }}>
            Enable Mocking
          </Button>
        </Flex>
      </Flex>
    </Paper>
  );
};
