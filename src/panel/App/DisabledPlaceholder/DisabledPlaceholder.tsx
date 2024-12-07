import React from 'react';
import { Button, Highlight, Paper, Title, createStyles } from '@mantine/core';
import { useGlobalStore } from '../store/useGlobalStore';

export const usePaperStyles = createStyles((theme) => ({
  full: {
    height: 430,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  }
}));

export const DisabledPlaceholder = () => {
  const active = useGlobalStore((state) => state.meta.active);
  const storeKey = useGlobalStore((state) => state.meta.storeKey);
  const tab = useGlobalStore((state) => state.meta.tab);

  console.log('DISABLED', storeKey);

  const { classes } = usePaperStyles();
  const onClick = () => {
    chrome.storage.local.set({ [storeKey]: !active }, () => {
      chrome.tabs.update(tab.id, { url: tab.url });
      location.reload();
    });
  };

  return (
    <Paper className={classes.full}>
      <Title order={4}>Mocking is disabled by default on non-localhost urls.</Title>
      <Highlight highlight="refresh the current page">
        Enabling will refresh the current page.
      </Highlight>
      <Button size="xs" onClick={onClick} mt={16}>
        Enable Mocking
      </Button>
    </Paper>
  );
};
