import React from "react";
import { SideDrawer } from "../../Blocks/SideDrawer";
import { useChromeStore, useChromeStoreState } from "../../store/useMockStore";
import { AddGroupForm } from "./AddGroup.Form";

const useGroupStoreSelector = (state: useChromeStoreState) => ({
  store: state.store,
  selectedGroup: state.selectedGroup,
  setSelectedGroup: state.setSelectedGroup,
  setStoreProperties: state.setStoreProperties,
});

export const AddGroup = () => {
  const {
    store,
    selectedGroup,
    setSelectedGroup,
    setStoreProperties,
  } = useChromeStore(useGroupStoreSelector);

  return (
    <SideDrawer minWidth={480}>
      <AddGroupForm
        key={`${selectedGroup.id}`}
        store={store}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        setStoreProperties={setStoreProperties}
      />
    </SideDrawer>
  );
};
