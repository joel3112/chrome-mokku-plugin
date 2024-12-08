import React from 'react';
import { useChromeStore, useChromeStoreState } from '@mokku/store';
import { SideDrawer } from '../../Blocks/SideDrawer';
import { AddGroupForm } from './AddGroup.Form';

const useGroupStoreSelector = (state: useChromeStoreState) => ({
  workspaceStore: state.workspaceStore,
  selectedGroup: state.selectedGroup,
  setStoreProperties: state.setStoreProperties
});

export const AddGroup = ({ onClose }: { onClose: () => void }) => {
  const { workspaceStore, selectedGroup, setStoreProperties } =
    useChromeStore(useGroupStoreSelector);

  return (
    <SideDrawer minWidth={520}>
      <AddGroupForm
        key={`${selectedGroup.id}`}
        workspaceStore={workspaceStore}
        selectedGroup={selectedGroup}
        setStoreProperties={setStoreProperties}
        onClose={onClose}
      />
    </SideDrawer>
  );
};
