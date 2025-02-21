import React, { ComponentProps, useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { ColorScheme, Text, createStyles, rem } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import Editor, { loader } from '@monaco-editor/react';

export const useStyles = createStyles((theme) => ({
  editor: {
    border: `0.0625rem solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4]
    }`,
    borderRadius: rem(4),
    overflow: 'hidden'
  },
  error: {
    color: theme.colorScheme === 'dark' ? theme.colors.red[8] : theme.colors.red[6]
  },
  borderActive: {
    borderColor: theme.colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[6]
  },
  borderError: {
    borderColor: theme.colorScheme === 'dark' ? theme.colors.red[8] : theme.colors.red[6]
  }
}));

loader.config({ monaco });

type CodeEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  height?: number;
  error?: string;
  formatOnBlur?: boolean;
  readOnly?: boolean;
};

export const JsonEditor = ({
  value,
  onChange,
  error = 'Invalid JSON',
  height = 500,
  formatOnBlur,
  readOnly
}: CodeEditorProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [colorScheme] = useLocalStorage<ColorScheme>({ key: 'color-scheme' });
  const { classes, cx } = useStyles();

  const editorRef = useRef<Parameters<ComponentProps<typeof Editor>['onMount']>[0]>(null);

  const [defaultValue, setDefaultValue] = useState('');
  useEffect(() => {
    value && setDefaultValue(JSON.stringify(JSON.parse(value), null, 2));
  }, []);

  useEffect(() => {
    if (editorRef.current && formatOnBlur && !isFocused) {
      !hasError && value && editorRef.current.setValue(JSON.stringify(JSON.parse(value), null, 2));
    }
  }, [isFocused]);

  return (
    <>
      {hasError && (
        <Text size="xs" mb={4} className={classes.error}>
          {error}
        </Text>
      )}
      <Editor
        className={cx(classes.editor, {
          [classes.borderActive]: isFocused,
          [classes.borderError]: isFocused && hasError
        })}
        height={height}
        defaultLanguage="json"
        defaultValue={defaultValue}
        onMount={(editor) => {
          editorRef.current = editor;
          editor.onDidFocusEditorWidget(() => setIsFocused(true));
          editor.onDidBlurEditorWidget(() => setIsFocused(false));
        }}
        onChange={(value) => {
          onChange?.(value);
          try {
            JSON.stringify(JSON.parse(value), null, 2);
            setHasError(false);
          } catch (e) {
            setHasError(true);
          }
        }}
        theme={colorScheme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          padding: { top: 10, bottom: 10 },
          minimap: { enabled: false },
          lineNumbers: 'off',
          formatOnType: true,
          formatOnPaste: true,
          fontSize: 11.5,
          fontFamily:
            'Lilex,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace',
          scrollBeyondLastLine: false,
          readOnly
        }}
      />
    </>
  );
};
