import React from 'react';
import { ImSwitch } from 'react-icons/im';
import { ActionIcon } from '@mantine/core';
import { useGlobalStore } from '@mokku/store';
import { IHostStore } from '@mokku/types';

export const SwitchButton = () => {
  const active = useGlobalStore((state) => state.meta.active);
  const storeKey = useGlobalStore((state) => state.meta.storeKey);
  const toggleActive = () => {
    const hostStore: IHostStore = { active: !active };
    chrome.storage.local.set({ [storeKey]: hostStore }, () => {
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
