import React from 'react';
import { IconType } from 'react-icons';
import { TbPlus } from 'react-icons/tb';
import { Button, ButtonProps, rem } from '@mantine/core';

type AddButtonProps = {
  variant?: ButtonProps['variant'];
  color?: ButtonProps['color'];
  Icon?: IconType;
  children: React.ReactNode;
  onClick: () => void;
};

export const SettingsButton = ({
  children,
  onClick,
  variant,
  color,
  Icon = TbPlus
}: AddButtonProps) => {
  return (
    <Button
      size="xs"
      variant={variant}
      color={color}
      leftIcon={<Icon size={14} />}
      onClick={onClick}
      px={9}
      styles={{
        leftIcon: {
          marginRight: rem(5)
        }
      }}>
      {children}
    </Button>
  );
};
