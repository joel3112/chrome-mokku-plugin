import React, { ComponentProps } from 'react';
import { Flex, SegmentedControl as SegmentedControlBase, Text } from '@mantine/core';

type SegmentedControlProps = ComponentProps<typeof SegmentedControlBase> & {
  label?: React.ReactNode;
};

export const SegmentedControl = ({ label, size = 'sm', ...props }: SegmentedControlProps) => {
  return (
    <Flex direction="column">
      <Text fw={500} size={size} component="label">
        {label}
      </Text>
      <SegmentedControlBase {...props} size={size} />
    </Flex>
  );
};
