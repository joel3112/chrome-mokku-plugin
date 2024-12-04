import * as React from "react";
import { Flex, Paper, Text, Title } from "@mantine/core";
import { usePaperStyles } from "../DisabledPlaceholder/DisabledPlaceholder";

interface PlaceholderProps {
  description: string;
  title: string;
}

export const Placeholder = ({ description, title }: PlaceholderProps) => {
  const { classes } = usePaperStyles();

  return (
    <Paper className={classes.full}>
      <Flex direction="column">
        <Title order={4}>{title}</Title>
        <Text>{description}</Text>
      </Flex>
    </Paper>
  );
};
