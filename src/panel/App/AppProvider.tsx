import React, { useEffect, useState } from 'react';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { defaultTheme } from '@mokku/services';
import { useGlobalStoreState } from '@mokku/store';
import '../../styles/fonts.css';
import { App } from './App';

export const AppProvider = (props: useGlobalStoreState['meta']) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultTheme);
  const toggleColorScheme = (current: ColorScheme) => setColorScheme(current);

  useEffect(() => {
    chrome.devtools.panels.setThemeChangeHandler((theme) => {
      toggleColorScheme(theme as ColorScheme);
    });
  }, []);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: '"UberMoveText", system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontFamilyMonospace:
            'Lilex, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace, Menlo, Monaco, "Courier New", monospace',
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
