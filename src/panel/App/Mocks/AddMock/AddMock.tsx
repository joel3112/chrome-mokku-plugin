import React from 'react';
import { useChromeStore, useChromeStoreState } from '@mokku/store';
import { IMockResponseRaw } from '@mokku/types';
import { SideDrawer } from '../../Blocks/SideDrawer';
import { AddMockForm } from './AddMock.Form';

const useMockStoreSelector = (state: useChromeStoreState) => ({
  store: state.store,
  selectedMock: state.selectedMock,
  setSelectedMock: state.setSelectedMock,
  setStoreProperties: state.setStoreProperties
});

type AddMockProps = {
  onClose: () => void;
  onFormChange?: (values: IMockResponseRaw) => void;
};

export const AddMock = ({ onClose, onFormChange }: AddMockProps) => {
  const { store, selectedMock, setSelectedMock, setStoreProperties } =
    useChromeStore(useMockStoreSelector);

  return (
    <SideDrawer minWidth={520}>
      <AddMockForm
        key={`${selectedMock.id}-${selectedMock.url}`}
        store={store}
        selectedMock={selectedMock}
        setSelectedMock={setSelectedMock}
        setStoreProperties={setStoreProperties}
        onClose={onClose}
        onFormChange={onFormChange}
      />
    </SideDrawer>
  );
};
