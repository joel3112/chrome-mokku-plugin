import React from 'react';
import { TbPlus } from 'react-icons/tb';
import { Button, rem } from '@mantine/core';

type AddButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};

export const AddButton = ({ children, onClick }: AddButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size="xs"
      variant="light"
      radius="md"
      leftIcon={<TbPlus size={14} />}
      px={8}
      styles={{
        leftIcon: {
          marginRight: rem(2)
        }
      }}>
      {children}
    </Button>
  );
};
