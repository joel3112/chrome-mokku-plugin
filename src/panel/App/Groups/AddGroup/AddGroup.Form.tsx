import {
  Button,
  Card,
  createStyles,
  Flex,
  SegmentedControl,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { v4 as uuidv4 } from "uuid";
import React, { useMemo } from "react";
import { SideDrawerHeader } from "../../Blocks/SideDrawer";
import {
  GroupActionInFormEnum,
  GroupStatusEnum,
  IMockGroup,
  IMockGroupRaw,
} from "../../types";
import { useForm } from "@mantine/form";
import { MdClose } from "react-icons/md";
import { storeActions } from "../../service/storeActions";
import { useChromeStoreState } from "../../store/useMockStore";
import { notifications } from "@mantine/notifications";
import { useGlobalStore } from "../../store/useGlobalStore";

const useStyles = createStyles((theme) => ({
  flexGrow: {
    flexGrow: 2,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    padding: "0 !important",
    height: "100%",
    borderRadius: 0,
  },
  wrapper: {
    padding: 12,
    height: "100%",
    overflow: "auto",
    paddingTop: 0,
  },
  footer: {
    padding: 12,
    borderTop: `1px solid ${theme.colors.gray[2]}`,
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
    classes: { flexGrow, wrapper, footer, card },
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

  const groupAction = useMemo(() => {
    if (!selectedGroup.createdOn && selectedGroup.name) {
      return GroupActionInFormEnum.DUPLICATE;
    }
    if (!selectedGroup.createdOn) {
      return GroupActionInFormEnum.ADD;
    }
    return GroupActionInFormEnum.UPDATE;
  }, [selectedGroup]);
  const isNewGroup = groupAction !== GroupActionInFormEnum.UPDATE;

  return (
    <form
      style={{ height: "100%" }}
      onSubmit={form.onSubmit((values) => {
        console.log("Submit group", values);
        const originalId = selectedGroup.id;
        const storeAction = {
          [GroupActionInFormEnum.ADD]: storeActions.addGroups,
          [GroupActionInFormEnum.UPDATE]: storeActions.updateGroups,
          [GroupActionInFormEnum.DUPLICATE]: storeActions.duplicateGroup,
        };
        if (!values.createdOn) {
          values.id = uuidv4();
        }

        const updatedStore = storeAction[groupAction](
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
            console.error(error);
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
        <Card className={card}>
          <SideDrawerHeader>
            <Title order={6}>{isNewGroup ? "Add Group" : "Update Group"}</Title>
            <MdClose style={{ cursor: "pointer" }} onClick={onClose} />
          </SideDrawerHeader>
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
          <Flex className={footer} justify="flex-end">
            <Flex justify="flex-end" gap={4}>
              <Button color="red" compact onClick={onClose}>
                Close
              </Button>
              <Button compact type="submit">
                {isNewGroup ? "Add Group" : "Update Group"}
              </Button>
            </Flex>
          </Flex>
        </Card>
      </>
    </form>
  );
};
