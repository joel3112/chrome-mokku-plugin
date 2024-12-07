import React from "react";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";

import { useGlobalStoreState } from "./store";
import { App } from "./App";
import { defaultTheme } from "@mokku/services";
import { useLocalStorage } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";

export const AppProvider = (props: useGlobalStoreState["meta"]) => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "color-scheme",
    defaultValue: defaultTheme,
  });

  const toggleColorScheme = () =>
    setColorScheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme }}
      >
        <ModalsProvider>
          <App {...props} />
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
