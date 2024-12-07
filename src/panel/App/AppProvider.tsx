import React from 'react';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { defaultTheme } from '@mokku/services';
import { App } from './App';
import { useGlobalStoreState } from './store';

export const AppProvider = (props: useGlobalStoreState['meta']) => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: defaultTheme
  });

  const toggleColorScheme = () =>
    setColorScheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme }}>
        <ModalsProvider>
          <App {...props} />
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
