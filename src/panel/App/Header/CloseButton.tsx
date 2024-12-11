import * as React from 'react';
import { MdClose } from 'react-icons/md';
import { ActionIcon } from '@mantine/core';

export const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <ActionIcon variant="outline" color={'blue'} onClick={onClick} title="Close">
    <MdClose />
  </ActionIcon>
);
