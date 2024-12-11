import React from 'react';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { defaultTheme } from '@mokku/services';
import { useGlobalStoreState } from '@mokku/store';
import { App } from './App';

export const AppProvider = (props: useGlobalStoreState['meta']) => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: defaultTheme
  });

  const toggleColorScheme = () =>
    setColorScheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme,
          components: {
            Button: {
              defaultProps: {
                radius: 'md'
              }
            },
            ActionIcon: {
              defaultProps: {
                radius: 'md'
              }
            }
          }
        }}>
        <ModalsProvider>
          <App {...props} />
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
