import React from 'react';
import { useChromeStore } from '@mokku/store';
import { SideDrawer } from '../../Blocks/SideDrawer';
import { AddGroupForm } from './AddGroup.Form';

export const AddGroup = ({ onClose }: { onClose: () => void }) => {
  const selectedGroup = useChromeStore((state) => state.selectedGroup);

  return (
    <SideDrawer minWidth={520}>
      <AddGroupForm key={`${selectedGroup.id}`} onClose={onClose} />
    </SideDrawer>
  );
};
