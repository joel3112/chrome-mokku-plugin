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
import React from "react";
import { SideDrawerHeader } from "../../Blocks/SideDrawer";
import { GroupStatusEnum, IMockGroup, IMockGroupRaw } from "../../types";
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
}: Pick<
  useChromeStoreState,
  "store" | "selectedGroup" | "setSelectedGroup" | "setStoreProperties"
>) => {
  const {
    classes: { flexGrow, wrapper, footer, card },
  } = useStyles();
  const tab = useGlobalStore((state) => state.meta.tab);

  const form = useForm<IMockGroupRaw>({
    initialValues: {
      active: true,
      ...selectedGroup,
    },
  });
  const isNewGroup = !selectedGroup.id;

  return (
    <form
      style={{ height: "100%" }}
      onSubmit={form.onSubmit((values) => {
        console.log(899, values);
        if (!values.id) {
          values.id = uuidv4();
        }
        const updatedStore = isNewGroup
          ? storeActions.addGroups(store, values as IMockGroup)
          : storeActions.updateGroups(store, values as IMockGroup);
        storeActions
          .updateStoreInDB(updatedStore)
          .then(setStoreProperties)
          .then(() => {
            storeActions.refreshContentStore(tab.id);
            setSelectedGroup();
            notifications.show({
              title: `${values.name} group ${isNewGroup ? "added" : "updated"}`,
              message: `Group "${values.name}" has been ${
                isNewGroup ? "added" : "updated"
              }.`,
            });
          })
          .catch(() => {
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
            <MdClose
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedGroup()}
            />
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
              <Button
                color="red"
                compact
                onClick={() => setSelectedGroup(undefined)}
              >
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
