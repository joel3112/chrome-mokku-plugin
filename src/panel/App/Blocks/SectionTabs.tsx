import React from 'react';
import { Tabs, TabsProps, rem } from '@mantine/core';

export const SectionTabs = (props: TabsProps) => {
  return (
    <Tabs
      unstyled
      radius="md"
      styles={(theme) => ({
        tab: {
          ...theme.fn.focusStyles(),
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9],
          border: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[4]}`,
          borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[4],
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
          cursor: 'pointer',
          fontSize: theme.fontSizes.sm,
          display: 'flex',
          alignItems: 'center',
          width: '100%',

          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed'
          },

          '&:not(:first-of-type)': {
            borderLeft: 0
          },

          '&:first-of-type': {
            borderTopLeftRadius: theme.radius.sm,
            borderBottomLeftRadius: theme.radius.sm
          },

          '&:last-of-type': {
            borderTopRightRadius: theme.radius.sm,
            borderBottomRightRadius: theme.radius.sm
          },

          '&[data-active]': {
            border: `${rem(1)} solid ${theme.colors.blue[7]}`
          }
        },

        tabIcon: {
          marginRight: theme.spacing.xs,
          display: 'flex',
          alignItems: 'center'
        },

        tabsList: {
          display: 'flex'
        }
      })}
      {...props}
    />
  );
};
