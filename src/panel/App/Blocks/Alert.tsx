import { Button, Flex, Modal } from "@mantine/core";
import React from "react";

type AlertProps = {
  opened: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  size?: string;
  actions: {
    text: string;
    variant?: string;
    onClick: () => void;
    color?: string;
  }[];
};

export const Alert = ({
  opened,
  onClose,
  title,
  content,
  actions,
  size = "md",
}: AlertProps) => {
  return (
    <Modal
      opened={opened}
      withCloseButton
      onClose={onClose}
      size={size}
      title={title}
      overlayProps={{ opacity: 0.3 }}
      centered
    >
      <Flex gap={4} direction="column" mb={16}>
        {content}
      </Flex>
      <Flex gap={4} justify="flex-end">
        {actions.map((action) => (
          <Button
            key={action.text}
            onClick={() => {
              action.onClick();
            }}
            color={action.color}
            variant={action.variant}
          >
            {action.text}
          </Button>
        ))}
      </Flex>
    </Modal>
  );
};
