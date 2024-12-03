import {
  Card,
  createStyles,
  Flex,
  SegmentedControl,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import {
  ActionInFormEnum,
  GroupStatusEnum,
  IMockGroup,
  IMockGroupRaw,
} from "../../types";
import { useForm } from "@mantine/form";
import { storeActions } from "../../service/storeActions";
import { useChromeStoreState } from "../../store/useMockStore";
import { notifications } from "@mantine/notifications";
import { useGlobalStore } from "../../store/useGlobalStore";
import { getActionInForm } from "../../Blocks/Modal";

const useStyles = createStyles((theme) => ({
  flexGrow: {
    flexGrow: 2,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    paddingBlock: 12,
    paddingInline: 2,
    height: "100%",
    borderRadius: 0,
  },
  wrapper: {
    padding: 12,
    height: "100%",
    overflow: "auto",
    paddingTop: 0,
  },
}));

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
    classes: { flexGrow, wrapper, card },
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
      style={{ height: "100%" }}
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
            <Flex gap={12} align="center">
              <Flex direction="column">
                <Text fw={500} fz="sm">
                  Status
                </Text>
                <SegmentedControl
                  value={
                    form.values.active
                      ? GroupStatusEnum.ACTIVE
                      : GroupStatusEnum.INACTIVE
                  }
                  onChange={(value) =>
                    form.setFieldValue(
                      "active",
                      value === GroupStatusEnum.ACTIVE
                    )
                  }
                  size="xs"
                  data={[
                    { label: "Active", value: GroupStatusEnum.ACTIVE },
                    { label: "Inactive", value: GroupStatusEnum.INACTIVE },
                  ]}
                />
              </Flex>
              <TextInput
                required
                label="Name"
                placeholder="Goals group"
                className={flexGrow}
                data-autofocus
                {...form.getInputProps("name")}
              />
            </Flex>
            <Flex gap={12} align="center">
              <Textarea
                className={flexGrow}
                label="Description"
                placeholder="Group case for goals mocks"
                {...form.getInputProps("description")}
              />
            </Flex>
          </Flex>
        </Card>
      </>
    </form>
  );
};
