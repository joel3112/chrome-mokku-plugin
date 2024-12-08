import React, { useEffect } from 'react';
import { Flex } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ViewEnum, useChromeStore, useGlobalStore, useGlobalStoreState } from '@mokku/store';
import { Modal } from './Blocks/Modal';
import { Show } from './Blocks/Show';
import { DisabledPlaceholder } from './DisabledPlaceholder/DisabledPlaceholder';
import { Header } from './Header';
import { Logs } from './Logs/Logs';
import { Mocks } from './Mocks/Mocks';
import { usePanelListener } from './hooks/usePanelListner';

export const App = (props: useGlobalStoreState['meta']) => {
  const state = usePanelListener(props);

  const setMeta = useGlobalStore((state) => state.setMeta);
  const view = useGlobalStore((state) => state.view);

  const initMockStore = useChromeStore((state) => state.init);

  useEffect(() => {
    initMockStore();
    setMeta(props);
  }, []);

  if (!state.active) {
    return <DisabledPlaceholder />;
  }

  return (
    <>
      <Notifications id="notification-mocks" zIndex={999} />
      <Flex direction="column" style={{ minWidth: 900, height: '100%', overflow: 'hidden' }}>
        <Header />
        <div style={{ overflow: 'auto', flexGrow: 2 }}>
          <Show if={view === ViewEnum.MOCKS}>
            <Mocks />
          </Show>
          <Show if={view === ViewEnum.LOGS}>
            <Logs />
          </Show>
        </div>
      </Flex>
      <Modal />
    </>
  );
};
