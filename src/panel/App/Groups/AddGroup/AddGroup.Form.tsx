import { Card, Flex, Textarea, TextInput } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import {
  ActionInFormEnum,
  GroupStatusEnum,
  IMockGroup,
  IMockGroupRaw,
} from "@mokku/types";
import { useForm } from "@mantine/form";
import { storeActions } from "../../service/storeActions";
import { useChromeStoreState, useGlobalStore } from "@mokku/store";
import { notifications } from "@mantine/notifications";
import { FORM_ID, getActionInForm } from "../../Blocks/Modal";
import { useStyles } from "../../Mocks/AddMock/AddMock.Form";
import { SegmentedControl } from "../../Blocks/SegmentedControl";

export const AddGroupForm = ({
  store,
  selectedGroup,
  setSelectedGroup,
  setStoreProperties,
  onClose,
}: Pick<
  useChromeStoreState,
  "store" | "selectedGroup" | "setSelectedGroup" | "setStoreProperties"
> & { onClose: () => void }) => {
  const {
    classes: { wrapper, card },
  } = useStyles();
  const tab = useGlobalStore((state) => state.meta.tab);

  const form = useForm<IMockGroupRaw>({
    initialValues: {
      active: true,
      name: "",
      description: "",
      ...selectedGroup,
    },
  });

  const action = getActionInForm(selectedGroup);
  const isNewGroup = action !== ActionInFormEnum.UPDATE;

  return (
    <form
      id={FORM_ID}
      onSubmit={form.onSubmit((values) => {
        console.log("Submit group", values);
        if (!values.createdOn) {
          values.id = uuidv4();
        }

        const originalId = selectedGroup.id;
        const storeAction = {
          [ActionInFormEnum.ADD]: storeActions.addGroups,
          [ActionInFormEnum.UPDATE]: storeActions.updateGroups,
          [ActionInFormEnum.DUPLICATE]: storeActions.duplicateGroup,
        };
        const updatedStore = storeAction[action](
          store,
          values as IMockGroup,
          originalId
        );

        storeActions
          .updateStoreInDB(updatedStore)
          .then(setStoreProperties)
          .then(() => {
            onClose();
            storeActions.refreshContentStore(tab.id);
            notifications.show({
              title: `${values.name} group ${isNewGroup ? "added" : "updated"}`,
              message: `Group "${values.name}" has been ${
                isNewGroup ? "added" : "updated"
              }.`,
            });
          })
          .catch((error) => {
            console.error("Failed to update store:", error);
            notifications.show({
              title: `Cannot ${isNewGroup ? "add" : "update"} group.`,
              message: `Something went wrong, unable to ${
                isNewGroup ? "add" : "update"
              } new group.`,
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
                placeholder="Goals group"
                data-autofocus
                maw={340}
                style={{ flex: 1 }}
                {...form.getInputProps("name")}
              />
              <SegmentedControl
                label="Status"
                value={
                  form.values.active
                    ? GroupStatusEnum.ACTIVE
                    : GroupStatusEnum.INACTIVE
                }
                onChange={(value) =>
                  form.setFieldValue("active", value === GroupStatusEnum.ACTIVE)
                }
                data={[
                  { label: "Active", value: GroupStatusEnum.ACTIVE },
                  { label: "Inactive", value: GroupStatusEnum.INACTIVE },
                ]}
              />
            </Flex>
            <Textarea
              label="Description"
              placeholder="Group case for goals mocks"
              {...form.getInputProps("description")}
            />
          </Flex>
        </Card>
      </>
    </form>
  );
};
