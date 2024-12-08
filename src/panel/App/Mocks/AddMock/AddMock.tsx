import React from 'react';
import { useChromeStore, useChromeStoreState } from '@mokku/store';
import { IMockResponseRaw } from '@mokku/types';
import { SideDrawer } from '../../Blocks/SideDrawer';
import { AddMockForm } from './AddMock.Form';

const useMockStoreSelector = (state: useChromeStoreState) => ({
  workspaceStore: state.workspaceStore,
  selectedMock: state.selectedMock,
  setStoreProperties: state.setStoreProperties
});

type AddMockProps = {
  onClose: () => void;
  onFormChange?: (values: IMockResponseRaw) => void;
};

export const AddMock = ({ onClose, onFormChange }: AddMockProps) => {
  const { workspaceStore, selectedMock, setStoreProperties } = useChromeStore(useMockStoreSelector);

  return (
    <SideDrawer minWidth={520}>
      <AddMockForm
        key={`${selectedMock.id}-${selectedMock.url}`}
        workspaceStore={workspaceStore}
        selectedMock={selectedMock}
        setStoreProperties={setStoreProperties}
        onClose={onClose}
        onFormChange={onFormChange}
      />
    </SideDrawer>
  );
};
