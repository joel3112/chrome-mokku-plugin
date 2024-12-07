import React from 'react';
import { TbRefresh } from 'react-icons/tb';
import { ActionIcon } from '@mantine/core';

export const RefreshButton = () => {
  return (
    <ActionIcon
      variant="outline"
      color={'blue'}
      onClick={() => window.location.reload()}
      title="Refresh Extension"
      radius="md">
      <TbRefresh />
    </ActionIcon>
  );
};
