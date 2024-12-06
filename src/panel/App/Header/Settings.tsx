import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  ColorScheme,
  createStyles,
  FileButton,
  Flex,
  Text,
  Title,
} from "@mantine/core";
import { MdClose } from "react-icons/md";
import { BsPaypal } from "react-icons/bs";
import { AiFillGithub } from "react-icons/ai";
import { SiBuymeacoffee } from "react-icons/si";
import { RiChromeFill } from "react-icons/ri";
import { CiExport, CiImport, CiTrash } from "react-icons/ci";
import { IStore } from "@mokku/types";
import { notifications } from "@mantine/notifications";
import { StoreSchema } from "../service/schema";
import { storeActions, updateStoreInDB } from "../service/storeActions";
import { useChromeStore } from "../store";
import { useLocalStorage } from "@mantine/hooks";
import { modals } from "@mantine/modals";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "fixed",
    left: 0,
    top: 0,
    height: "100%",
    width: "100%",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
  },
}));

const downloadJsonFile = (object: any, fileName: string) => {
  const jsonString = JSON.stringify(object, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);

  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const extractJsonFromFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const jsonData = JSON.parse(reader.result as string);
        const parsedData = StoreSchema.parse(jsonData);

        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read the file"));
    reader.readAsText(file);
  });
};

export const Settings = ({
  store,
  onClose,
}: {
  store: IStore;
  onClose: () => void;
}) => {
  const [colorScheme] = useLocalStorage<ColorScheme>({ key: "color-scheme" });
  const { classes } = useStyles();
  const [file, setFile] = useState<File | null>(null);
  const resetRef = useRef<() => void>(null);
  const setStoreProperties = useChromeStore(
    (state) => state.setStoreProperties
  );

  useEffect(() => {
    if (file) {
      extractJsonFromFile(file)
        .then((jsonData) => {
          onClose();
          updateStoreInDB({ ...store, ...jsonData }).then(setStoreProperties);
          notifications.show({
            title: `Import data`,
            message: `Data imported successfully`,
          });
        })
        .catch((error) => {
          console.error("Failed to import data:", error);
          notifications.show({
            id: "import-data-error",
            title: `Import data`,
            message: `Failed to import data`,
            color: "red",
          });
        })
        .finally(() => {
          setFile(null);
          resetRef.current?.();
        });
    }
  }, [file]);

  const handleClear = () =>
    modals.openConfirmModal({
      title: "Clear data",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to remove your data? This action is destructive
          and you will lose all your data.
        </Text>
      ),
      labels: { confirm: "Clear", cancel: "No don't clear it" },
      confirmProps: { color: "red" },
      onCancel: onClose,
      onConfirm: () => {
        onClose();
        storeActions.resetStoreInDB().then(setStoreProperties);
        notifications.show({
          title: `Clear data`,
          message: `All data cleared successfully`,
        });
      },
    });

  return (
    <Card className={classes.wrapper}>
      <Flex direction="row-reverse">
        <ActionIcon
          variant="outline"
          color={"blue"}
          onClick={() => onClose()}
          title="Toggle Theme"
          radius="md"
        >
          <MdClose />
        </ActionIcon>
      </Flex>
      <Flex direction="column" align="center" gap="100px">
        <Flex direction="column" align="center" gap="16px">
          <Title order={4}>Settings</Title>
          <Text style={{ maxWidth: 480 }} fz="sm">
            You can import and export your data, change the theme, and clear
            all.
          </Text>
          <Flex direction="column" align="center">
            <Flex gap="8px">
              <FileButton
                onChange={setFile}
                resetRef={resetRef}
                accept="application/json"
              >
                {(props) => (
                  <Button
                    size="xs"
                    leftIcon={<CiImport />}
                    variant="outline"
                    radius="md"
                    style={{ width: 240, marginBottom: 12 }}
                    {...props}
                  >
                    Import JSON
                  </Button>
                )}
              </FileButton>

              <Button
                size="xs"
                leftIcon={<CiExport />}
                variant="outline"
                radius="md"
                style={{ width: 240, marginBottom: 12 }}
                onClick={() => {
                  downloadJsonFile(store, "mokku-data.json");
                  notifications.show({
                    title: `Export data`,
                    message: `Data exported successfully, check your downloads`,
                  });
                }}
              >
                Export JSON
              </Button>
            </Flex>
            <Flex gap="8px">
              <Button
                size="xs"
                color="red"
                radius="md"
                leftIcon={<CiTrash />}
                variant="outline"
                style={{ width: 240, marginBottom: 12 }}
                onClick={handleClear}
              >
                Clear data
              </Button>
            </Flex>
          </Flex>
        </Flex>

        <Flex direction="column" align="center" gap="16px">
          <Title order={4}>Support the Mokku's Development</Title>
          <Text style={{ maxWidth: 480 }} fz="sm">
            Hi there 👋, I am an Indie developer, who works in his spare time to
            develop Mokku and help other developers around the world, your
            support is highly appreciated to keep the project alive.
          </Text>
          <Flex direction="column" align="center">
            <Flex gap="8px">
              <Button
                size="xs"
                radius="md"
                leftIcon={<BsPaypal />}
                variant="outline"
                style={{ width: 240, marginBottom: 12 }}
                onClick={() =>
                  chrome.tabs.create({
                    url:
                      "https://paypal.me/mukuljainx?country.x=IN&locale.x=en_GB",
                  })
                }
              >
                Paypal Me
              </Button>
              <Button
                size="xs"
                radius="md"
                color="orange"
                leftIcon={<SiBuymeacoffee />}
                variant="outline"
                style={{ width: 240, marginBottom: 12 }}
                onClick={() =>
                  chrome.tabs.create({
                    url: "https://www.buymeacoffee.com/mukuljainx",
                  })
                }
              >
                Buy me a Coffee
              </Button>
            </Flex>
            <Flex gap="8px">
              <Button
                size="xs"
                radius="md"
                color={colorScheme === "dark" ? "gray" : "dark"}
                leftIcon={<AiFillGithub />}
                variant="outline"
                style={{ width: 240, marginBottom: 12 }}
                onClick={() =>
                  chrome.tabs.create({
                    url:
                      "https://github.com/mukuljainx/mokku-bug-trakcer/issues",
                  })
                }
              >
                Raise Issue on Github
              </Button>
              <Button
                size="xs"
                radius="md"
                color="indigo"
                leftIcon={<RiChromeFill />}
                variant="outline"
                style={{ width: 240, marginBottom: 12 }}
                onClick={() =>
                  chrome.tabs.create({
                    url:
                      "https://chrome.google.com/webstore/detail/mokku/llflfcikklhgamfmnjkgpdadpmdplmji",
                  })
                }
              >
                Review on Chrome Store
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
