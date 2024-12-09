import React from 'react';
import { useChromeStore } from '@mokku/store';
import { IMockResponseRaw } from '@mokku/types';
import { SideDrawer } from '../../Blocks/SideDrawer';
import { AddMockForm } from './AddMock.Form';

type AddMockProps = {
  onClose: () => void;
  onFormChange?: (values: IMockResponseRaw) => void;
};

export const AddMock = ({ onClose, onFormChange }: AddMockProps) => {
  const selectedMock = useChromeStore((state) => state.selectedMock);

  return (
    <SideDrawer minWidth={520}>
      <AddMockForm
        key={`${selectedMock.id}-${selectedMock.url}`}
        onClose={onClose}
        onFormChange={onFormChange}
      />
    </SideDrawer>
  );
};
