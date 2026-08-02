import React from 'react';
import { ImSwitch } from 'react-icons/im';
import { ActionIcon } from '@mantine/core';
import { useGlobalStore } from '@mokku/store';
import { storeActions } from '../service/storeActions';

export const SwitchButton = () => {
  const active = useGlobalStore((state) => state.meta.active);
  const host = useGlobalStore((state) => state.meta.host);
  const toggleActive = () => {
    storeActions.setHostActive(host, !active).then(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
        location.reload();
      });
    });
  };

  return (
    <ActionIcon
      variant="outline"
      color="red"
      onClick={() => toggleActive()}
      title="Disable Mocking">
      <ImSwitch />
    </ActionIcon>
  );
};
