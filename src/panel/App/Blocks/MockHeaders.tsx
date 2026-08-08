import React from 'react';
import { TbTrash } from 'react-icons/tb';
import { ActionIcon, Center, Code, Flex, TextInput, createStyles } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Headers } from '@mokku/types';
import { SettingsButton } from '../Header/SettingsButton';

export const useStyles = createStyles(() => ({
  flexGrow: {
    flexGrow: 2
  }
}));

type MockHeadersProps = {
  buttonAddText?: string;
  headers: Headers;
  readOnly?: boolean;
  onChange?: (headers: Headers) => void;
};

// need to update the headers state when the headers prop changes
export const MockHeaders = ({ headers, readOnly, onChange, buttonAddText }: MockHeadersProps) => {
  const { classes } = useStyles();
  const [initialHeaders] = React.useState<Headers>(headers);
  const form = useForm<{ headers: Headers }>({
    initialValues: {
      headers: initialHeaders
    }
  });

  // tracks the last value both sides agreed on, so we can tell a "real"
  // external change (prop) apart from the echo caused by our own onChange,
  // and avoid looping forever just because Mantine hands back new
  // array/object references every time even when the content is identical
  const lastSyncedHeaders = React.useRef(initialHeaders);

  React.useEffect(() => {
    if (JSON.stringify(headers) !== JSON.stringify(lastSyncedHeaders.current)) {
      lastSyncedHeaders.current = headers;
      form.setValues({ headers });
    }
  }, [headers]);

  React.useEffect(() => {
    if (onChange && JSON.stringify(form.values.headers) !== JSON.stringify(lastSyncedHeaders.current)) {
      lastSyncedHeaders.current = form.values.headers;
      onChange(form.values.headers);
    }
  }, [form.values]);

  if (readOnly && headers.length === 0) {
    return (
      <Center pt={6}>
        <Code fz={12} bg="transparent">
          No Headers
        </Code>
      </Center>
    );
  }

  return (
    <Flex gap={6} direction="column" align="stretch" mt={4}>
      {!readOnly && (
        <div>
          <SettingsButton
            onClick={() => {
              form.insertListItem('headers', { name: '', value: '' }, 0);
            }}>
            {buttonAddText ?? 'Add Header'}
          </SettingsButton>
        </div>
      )}

      <Flex gap={4} direction="column">
        {form.values.headers?.map((_, index) => (
          <Flex gap={4} align="center" key={index}>
            <TextInput
              required
              readOnly={readOnly}
              size="xs"
              placeholder="Name"
              styles={(theme) => ({
                root: {
                  width: '45%'
                },
                input: {
                  fontFamily: theme.fontFamilyMonospace,
                  color: theme.colors.blue[7]
                }
              })}
              {...form.getInputProps(`headers.${index}.name`)}
            />
            :
            <TextInput
              required
              readOnly={readOnly}
              size="xs"
              placeholder="Value"
              className={classes.flexGrow}
              styles={(theme) => ({
                input: {
                  fontFamily: theme.fontFamilyMonospace
                }
              })}
              {...form.getInputProps(`headers.${index}.value`)}
            />
            {!readOnly && (
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => form.removeListItem('headers', index)}
                title="Delete">
                <TbTrash />
              </ActionIcon>
            )}
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
