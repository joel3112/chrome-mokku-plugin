import { useEffect, useRef } from 'react';
import { useChromeStore, useGlobalStore } from '@mokku/store';
import { UNIQUE_INSTANCE_ID } from '../service/storeActions';


export const useListenStoreChanges = () => {
  const isDirty = useRef(false);
  const initMockStore = useChromeStore((state) => state.init);

  useEffect(() => {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;

      if (changes.lastUpdatedBy === undefined) {
        return;
      }
      const newValue = changes.lastUpdatedBy?.newValue as string | undefined;

      // 👇 clave
      // lastUpdatedBy tiene el formato "<instanceId>:<secuencia>" (ver emitChanges
      // en storeActions.ts), por eso comparamos solo el prefijo antes de ':'.
      if (newValue?.split(':')[0] === UNIQUE_INSTANCE_ID) {
        return; // ignorar cambios propios
      }

      isDirty.current = true;
    });

    window.addEventListener('focus', () => {
      if (isDirty.current) {
        initMockStore(useGlobalStore.getState().meta.host);
        isDirty.current = false;
      }
    });
  }, []);
}
