import { notifications } from '@mantine/notifications';
import { useChromeStore, useGlobalStore } from '@mokku/store';
import { IMockResponse } from '@mokku/types';
import { storeActions } from '../../service/storeActions';

export const useAddBulkMock = () => {
  const selectedWorkspace = useChromeStore((state) => state.selectedWorkspace);
  const setStoreProperties = useChromeStore((state) => state.setStoreProperties);
  const tab = useGlobalStore((state) => state.meta.tab);

  const addBulkMock = async (mocks: IMockResponse[]) => {
    const { workspaceStore } = await storeActions.getAllStore();
    const updatedWorkspaceStore = storeActions.addMocks(workspaceStore, mocks);

    storeActions
      .updateWorkspaceStoreInDB(selectedWorkspace.id, updatedWorkspaceStore)
      .then(setStoreProperties)
      .then(() => {
        storeActions.refreshContentStore(tab.id);
        notifications.show({
          title: 'Network calls mocked successfully.',
          message: 'Current recording of network calls has been mock successfully.'
        });
      })
      .catch((e) => {
        console.log(e);
        notifications.show({
          title: 'Cannot mock network calls.',
          message: 'Something went wrong, check console for more.'
        });
      });
  };

  return addBulkMock;
};
