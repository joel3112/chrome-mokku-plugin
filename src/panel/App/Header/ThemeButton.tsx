import React from 'react';
import { TbMoonStars, TbSun } from 'react-icons/tb';
import { ActionIcon, useMantineColorScheme } from '@mantine/core';

export const ThemeButton = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  localStorage.getItem('x1');

  return (
    <ActionIcon
      variant="outline"
      color={dark ? 'yellow' : 'blue'}
      onClick={() => toggleColorScheme()}
      title="Toggle Theme"
      radius="md">
      {dark ? <TbSun /> : <TbMoonStars />}
    </ActionIcon>
  );
};
