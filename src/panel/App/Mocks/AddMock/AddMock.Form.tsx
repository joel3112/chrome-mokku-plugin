import React, { useEffect } from 'react';
import { TbTrash } from 'react-icons/tb';
import { v4 as uuidv4 } from 'uuid';
import {
  ActionIcon,
  Card,
  Flex,
  NumberInput,
  Select,
  Tabs,
  TextInput,
  Textarea,
  createStyles
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useChromeStore, useChromeStoreState, useGlobalStore } from '@mokku/store';
import { ActionInFormEnum, IMockResponse, IMockResponseRaw, MethodEnum } from '@mokku/types';
import { JsonEditor } from '../../Blocks/JsonEditor';
import { FORM_ID, getActionInForm } from '../../Blocks/Modal';
import { Switch } from '../../Blocks/Switch';
import { SettingsButton } from '../../Header/SettingsButton';
import { storeActions } from '../../service/storeActions';
import { statusOptions } from './data';

export const useStyles = createStyles(() => ({
  flexGrow: {
    flexGrow: 2
  },
  right: {
    width: 300
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    background: 'transparent',
    height: '100%',
    borderRadius: 0
  },
  wrapper: {
    height: '100%',
    overflow: 'auto',
    paddingTop: 16,
    paddingBottom: 28,
    paddingInline: 20,
    textarea: {
      overflowY: 'clip'
    }
  },
  tabs: {
    flexGrow: 2,
    display: 'flex',
    flexDirection: 'column'
  }
}));

type AddMockFormProps = {
  onClose: () => void;
  onFormChange?: (values: IMockResponseRaw) => void;
};

const useMockStoreSelector = (state: useChromeStoreState) => ({
  workspaceStore: state.workspaceStore,
  selectedWorkspace: state.selectedWorkspace,
  selectedMock: state.selectedMock,
  setStoreProperties: state.setStoreProperties
});

export const AddMockForm = ({ onFormChange, onClose }: AddMockFormProps) => {
  const tab = useGlobalStore((state) => state.meta.tab);
  const { workspaceStore, selectedWorkspace, selectedMock, setStoreProperties } =
    useChromeStore(useMockStoreSelector);

  const { classes } = useStyles();

  const form = useForm<IMockResponseRaw>({
    initialValues: {
      headers: [],
      status: 200,
      delay: 500,
      method: MethodEnum.GET,
      active: true,
      groupId: '',
      name: '',
      description: '',
      url: '',
      ...selectedMock
    }
  });

  const action = getActionInForm(selectedMock);
  const isNewMock = action !== ActionInFormEnum.UPDATE;
  const isDuplicateMock = action === ActionInFormEnum.DUPLICATE;

  const isGroupSelectedActive = workspaceStore.groups.find(
    (group) => group.id === form.values.groupId
  )?.active;

  useEffect(() => {
    onFormChange?.(form.values);
  }, [form.values]);

  return (
    <form
      id={FORM_ID}
      onSubmit={form.onSubmit((values) => {
        console.log('Submit mock', values);
        if (!values.createdOn) {
          values.id = uuidv4();
        }
        try {
          values.status = parseInt(values.status as any);
        } catch (e) {
          values.status = 200;
        }

        const storeAction = {
          [ActionInFormEnum.ADD]: storeActions.addMocks,
          [ActionInFormEnum.UPDATE]: storeActions.updateMocks,
          [ActionInFormEnum.DUPLICATE]: storeActions.addMocks
        };
        const updatedWorkspaceStore = storeAction[action](workspaceStore, {
          ...values,
          groupId: values.groupId || ''
        } as IMockResponse);

        storeActions
          .updateWorkspaceStoreInDB(selectedWorkspace.id, updatedWorkspaceStore)
          .then(setStoreProperties)
          .then(() => {
            onClose();
            storeActions.refreshContentStore(tab.id);
            notifications.show({
              title: `${values.name} mock ${isNewMock ? 'added' : 'updated'}`,
              message: `Mock "${values.name}" has been ${isNewMock ? 'added' : 'updated'}.`
            });
          })
          .catch((error) => {
            console.error('Failed to add mock:', error);
            notifications.show({
              title: `Cannot ${isNewMock ? 'add' : 'update'} mock.`,
              message: `Something went wrong, unable to ${isNewMock ? 'add' : 'update'} new mock.`,
              color: 'red'
            });
          });
      })}>
      <>
        <Card className={classes.card} p={0}>
          <Flex direction="column" gap={16} className={classes.wrapper}>
            <Flex gap={15} justify="space-between" align="flex-end">
              <TextInput
                required
                label="Name"
                placeholder="Goals Success"
                data-autofocus
                className={classes.flexGrow}
                {...form.getInputProps('name')}
              />
              <Switch
                size="xl"
                radius="sm"
                onLabel="Active"
                offLabel="Inactive"
                {...form.getInputProps('active', { type: 'checkbox' })}
              />
            </Flex>
            <Select
              label="Group"
              placeholder="Select group"
              data={workspaceStore.groups.map((g) => ({ label: g.name, value: g.id }))}
              description={!isGroupSelectedActive && form.values.groupId && '⚠️ Group is disabled'}
              inputWrapperOrder={['label', 'input', 'description']}
              allowDeselect
              disabled={isDuplicateMock}
              style={{ display: 'inline-block' }}
              {...form.getInputProps('groupId')}
            />
            <Textarea
              label="Description"
              placeholder="Success case for goals API"
              {...form.getInputProps('description')}
            />
            <Flex gap={15} justify="space-between">
              <TextInput
                label="URL"
                required
                placeholder="https://api.awesomeapp.com/goals"
                disabled={isDuplicateMock}
                className={classes.flexGrow}
                {...form.getInputProps('url')}
              />
              <Select
                label="Method"
                w={130}
                data={[
                  { label: 'GET', value: MethodEnum.GET },
                  { label: 'POST', value: MethodEnum.POST },
                  { label: 'PUT', value: MethodEnum.PUT },
                  { label: 'PATCH', value: MethodEnum.PATCH },
                  { label: 'DELETE', value: MethodEnum.DELETE }
                ]}
                {...form.getInputProps('method')}
              />
            </Flex>
            <Flex gap={15} justify="space-between">
              <Select
                required
                label="Status"
                placeholder="Select status"
                data={statusOptions}
                className={classes.flexGrow}
                searchable
                {...form.getInputProps('status')}
              />
              <NumberInput
                required
                step={500}
                contentEditable={false}
                min={500}
                label="Delay (ms)"
                placeholder="500"
                w={130}
                {...form.getInputProps('delay')}
              />
            </Flex>

            <Flex className={classes.flexGrow} mt={16}>
              <Tabs defaultValue="body" className={classes.tabs}>
                <Tabs.List>
                  <Tabs.Tab value="body">Response Body</Tabs.Tab>
                  <Tabs.Tab value="headers">Response Headers</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="body" pt="xs" className={classes.flexGrow}>
                  <JsonEditor
                    value={form.values.response}
                    onChange={(value) => form.setFieldValue('response', value)}
                    formatOnBlur
                  />
                </Tabs.Panel>

                <Tabs.Panel value="headers" pt="xs">
                  <SettingsButton
                    onClick={() => {
                      form.insertListItem('headers', { name: '', value: '' }, 0);
                    }}>
                    Add Header
                  </SettingsButton>
                  <Flex gap={8} direction="column" mt={8}>
                    {form.values.headers?.map((_, index) => (
                      <Flex gap={12} align="center" key={index}>
                        <TextInput
                          required
                          size="xs"
                          placeholder="Name"
                          className={classes.flexGrow}
                          {...form.getInputProps(`headers.${index}.name`)}
                        />
                        <TextInput
                          required
                          size="xs"
                          placeholder="Value"
                          className={classes.flexGrow}
                          {...form.getInputProps(`headers.${index}.value`)}
                        />
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => form.removeListItem('headers', index)}
                          title="Delete header">
                          <TbTrash />
                        </ActionIcon>
                      </Flex>
                    ))}
                  </Flex>
                </Tabs.Panel>
              </Tabs>
            </Flex>
          </Flex>
        </Card>
      </>
    </form>
  );
};
