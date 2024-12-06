import {
  Button,
  Card,
  createStyles,
  Flex,
  JsonInput,
  NumberInput,
  rem,
  Select,
  Tabs,
  Textarea,
  TextInput,
} from "@mantine/core";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect } from "react";
import {
  ActionInFormEnum,
  IMockResponse,
  IMockResponseRaw,
  MethodEnum,
  MockStatusEnum,
} from "../../types";
import { useForm } from "@mantine/form";
import { MdDeleteOutline } from "react-icons/md";
import { storeActions } from "../../service/storeActions";
import { useChromeStoreState } from "../../store/useMockStore";
import { notifications } from "@mantine/notifications";
import { useGlobalStore } from "../../store/useGlobalStore";
import { FORM_ID, getActionInForm } from "../../Blocks/Modal";
import { statusOptions } from "./data";
import { SegmentedControl } from "../../Blocks/SegmentedControl";

export const useStyles = createStyles((theme) => ({
  flexGrow: {
    flexGrow: 2,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    background: "transparent",
    height: "100%",
    borderRadius: 0,
  },
  wrapper: {
    height: "100%",
    overflow: "auto",
    paddingBlock: 12,
    paddingInline: 20,
    "label:not([class*=SegmentedControl])": {
      fontSize: rem(13),
      marginBottom: 4,
    },
    textarea: {
      overflowY: "clip",
    },
  },
  tabs: {
    flexGrow: 2,
    display: "flex",
    flexDirection: "column",
  },
}));

type AddMockFormProps = Pick<
  useChromeStoreState,
  "store" | "selectedMock" | "setSelectedMock" | "setStoreProperties"
> & {
  onClose: () => void;
  onFormChange?: (values: IMockResponseRaw) => void;
};

export const AddMockForm = ({
  store,
  selectedMock,
  setSelectedMock,
  setStoreProperties,
  onFormChange,
  onClose,
}: AddMockFormProps) => {
  const {
    classes: { flexGrow, wrapper, tabs, card },
  } = useStyles();
  const tab = useGlobalStore((state) => state.meta.tab);

  const form = useForm<IMockResponseRaw>({
    initialValues: {
      headers: [],
      status: 200,
      delay: 500,
      method: MethodEnum.GET,
      active: true,
      groupId: "",
      name: "",
      description: "",
      url: "",
      ...selectedMock,
    },
  });

  const action = getActionInForm(selectedMock);
  const isNewMock = action !== ActionInFormEnum.UPDATE;
  const isDuplicateMock = action === ActionInFormEnum.DUPLICATE;

  const isGroupSelectedActive = store.groups.find(
    (group) => group.id === form.values.groupId
  )?.active;

  useEffect(() => {
    onFormChange?.(form.values);
  }, [form.values]);

  return (
    <form
      id={FORM_ID}
      onSubmit={form.onSubmit((values) => {
        console.log("Submit mock", values);
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
          [ActionInFormEnum.DUPLICATE]: storeActions.addMocks,
        };
        const updatedStore = storeAction[action](store, {
          ...values,
          groupId: values.groupId || "",
        } as IMockResponse);

        storeActions
          .updateStoreInDB(updatedStore)
          .then(setStoreProperties)
          .then(() => {
            onClose();
            storeActions.refreshContentStore(tab.id);
            notifications.show({
              title: `${values.name} mock ${isNewMock ? "added" : "updated"}`,
              message: `Mock "${values.name}" has been ${
                isNewMock ? "added" : "updated"
              }.`,
            });
          })
          .catch((error) => {
            console.error("Failed to add mock:", error);
            notifications.show({
              title: `Cannot ${isNewMock ? "add" : "update"} mock.`,
              message: `Something went wrong, unable to ${
                isNewMock ? "add" : "update"
              } new mock.`,
              color: "red",
            });
          });
      })}
    >
      <>
        <Card className={card} p={0}>
          <Flex direction="column" gap={16} className={wrapper}>
            <Flex gap={30} align="flex-end" justify="space-between">
              <TextInput
                required
                label="Name"
                placeholder="Goals Success"
                data-autofocus
                maw={340}
                style={{ flex: 1 }}
                {...form.getInputProps("name")}
              />
              <SegmentedControl
                label="Status"
                value={
                  form.values.active
                    ? MockStatusEnum.ACTIVE
                    : MockStatusEnum.INACTIVE
                }
                onChange={(value) =>
                  form.setFieldValue("active", value === MockStatusEnum.ACTIVE)
                }
                data={[
                  { label: "Active", value: MockStatusEnum.ACTIVE },
                  { label: "Inactive", value: MockStatusEnum.INACTIVE },
                ]}
              />
            </Flex>
            <Select
              label="Group"
              placeholder="Select group"
              data={store.groups.map((g) => ({ label: g.name, value: g.id }))}
              description={
                !isGroupSelectedActive &&
                form.values.groupId &&
                "⚠️ Group is disabled"
              }
              inputWrapperOrder={["label", "input", "description"]}
              allowDeselect
              disabled={isDuplicateMock}
              {...form.getInputProps("groupId")}
            />
            <Textarea
              label="Description"
              placeholder="Success case for goals API"
              {...form.getInputProps("description")}
            />
            <TextInput
              label="URL"
              required
              placeholder="https://api.awesomeapp.com/goals"
              disabled={isDuplicateMock}
              {...form.getInputProps("url")}
            />
            <Select
              required
              label="Status"
              placeholder="Select status"
              data={statusOptions}
              searchable
              {...form.getInputProps("status")}
            />
            <Flex gap={30} align="flex-end" justify="space-between">
              <SegmentedControl
                label="Method"
                value={form.values.method}
                onChange={(value) =>
                  form.setFieldValue("method", value as MethodEnum)
                }
                data={[
                  { label: "GET", value: MethodEnum.GET },
                  { label: "POST", value: MethodEnum.POST },
                  { label: "PUT", value: MethodEnum.PUT },
                  { label: "PATCH", value: MethodEnum.PATCH },
                  { label: "DELETE", value: MethodEnum.DELETE },
                ]}
                disabled={isDuplicateMock}
              />
              <NumberInput
                required
                step={500}
                contentEditable={false}
                min={500}
                label="Delay (ms)"
                placeholder="500"
                {...form.getInputProps("delay")}
              />
            </Flex>
            <Flex className={flexGrow}>
              <Tabs defaultValue="body" className={tabs}>
                <Tabs.List>
                  <Tabs.Tab value="body">Response Body</Tabs.Tab>
                  <Tabs.Tab value="headers">Response Headers</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="body" pt="xs" className={flexGrow}>
                  <JsonInput
                    placeholder="Response, this will auto resize. You can leave this empty or enter a valid JSON"
                    formatOnBlur
                    autosize
                    minRows={4}
                    {...form.getInputProps("response")}
                  />
                </Tabs.Panel>

                <Tabs.Panel value="headers" pt="xs">
                  <Button
                    variant="subtle"
                    style={{ marginBottom: 8 }}
                    onClick={() => {
                      form.insertListItem(
                        "headers",
                        {
                          name: "",
                          value: "",
                        },
                        0
                      );
                    }}
                  >
                    + Add Header
                  </Button>
                  <Flex gap={8} direction="column">
                    {form.values.headers?.map((_, index) => (
                      <Flex gap={12} align="center" key={index}>
                        <TextInput
                          required
                          placeholder="Name"
                          className={flexGrow}
                          {...form.getInputProps(`headers.${index}.name`)}
                        />
                        <TextInput
                          required
                          placeholder="Value"
                          className={flexGrow}
                          {...form.getInputProps(`headers.${index}.value`)}
                        />
                        <MdDeleteOutline
                          onClick={() => {
                            form.removeListItem("headers", index);
                          }}
                        />
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
