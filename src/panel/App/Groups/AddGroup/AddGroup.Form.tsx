import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, Chip, Flex, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useChromeStore, useChromeStoreState, useGlobalStore } from '@mokku/store';
import { ActionInFormEnum, IMockGroup, IMockGroupRaw } from '@mokku/types';
import { FORM_ID, getActionInForm } from '../../Blocks/Modal';
import { useStyles } from '../../Mocks/AddMock/AddMock.Form';
import { storeActions } from '../../service/storeActions';

type AddGroupFormProps = {
  onClose: () => void;
};

const useGroupStoreSelector = (state: useChromeStoreState) => ({
  workspaceStore: state.workspaceStore,
  selectedWorkspace: state.selectedWorkspace,
  selectedGroup: state.selectedGroup,
  setStoreProperties: state.setStoreProperties
});

export const AddGroupForm = ({ onClose }: AddGroupFormProps) => {
  const { classes } = useStyles();
  const tab = useGlobalStore((state) => state.meta.tab);
  const { workspaceStore, selectedWorkspace, selectedGroup, setStoreProperties } =
    useChromeStore(useGroupStoreSelector);

  const form = useForm<IMockGroupRaw>({
    initialValues: {
      active: true,
      name: '',
      description: '',
      ...selectedGroup
    }
  });

  const action = getActionInForm(selectedGroup);
  const isNewGroup = action !== ActionInFormEnum.UPDATE;

  return (
    <form
      id={FORM_ID}
      onSubmit={form.onSubmit((values) => {
        console.log('Submit group', values);
        if (!values.createdOn) {
          values.id = uuidv4();
        }

        const originalId = selectedGroup.id;
        const storeAction = {
          [ActionInFormEnum.ADD]: storeActions.addGroups,
          [ActionInFormEnum.UPDATE]: storeActions.updateGroups,
          [ActionInFormEnum.DUPLICATE]: storeActions.duplicateGroup
        };
        const updatedWorkspaceStore = storeAction[action](
          workspaceStore,
          values as IMockGroup,
          originalId
        );

        storeActions
          .updateWorkspaceStoreInDB(selectedWorkspace.id, updatedWorkspaceStore)
          .then(setStoreProperties)
          .then(() => {
            onClose();
            storeActions.refreshContentStore(tab.id);
            notifications.show({
              title: `${values.name} group ${isNewGroup ? 'added' : 'updated'}`,
              message: `Group "${values.name}" has been ${isNewGroup ? 'added' : 'updated'}.`
            });
          })
          .catch((error) => {
            console.error('Failed to update store:', error);
            notifications.show({
              title: `Cannot ${isNewGroup ? 'add' : 'update'} group.`,
              message: `Something went wrong, unable to ${
                isNewGroup ? 'add' : 'update'
              } new group.`,
              color: 'red'
            });
          });
      })}>
      <>
        <Card className={classes.card} p={0}>
          <Flex direction="column" gap={16} className={classes.wrapper}>
            <Flex gap={20} align="flex-end" justify="space-between">
              <TextInput
                required
                label="Name"
                placeholder="Goals group"
                data-autofocus
                style={{ flex: 1 }}
                {...form.getInputProps('name')}
              />
              <Chip
                radius="sm"
                size="lg"
                className={classes.chip}
                {...form.getInputProps('active', { type: 'checkbox' })}>
                Active
              </Chip>
            </Flex>
            <Textarea
              label="Description"
              placeholder="Group case for goals mocks"
              {...form.getInputProps('description')}
            />
          </Flex>
        </Card>
      </>
    </form>
  );
};
