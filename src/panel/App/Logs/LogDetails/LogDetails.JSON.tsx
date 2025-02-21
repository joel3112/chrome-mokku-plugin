import React from 'react';
import { Center, JsonInput, Text, createStyles } from '@mantine/core';
import { ILog } from '@mokku/types';
import { parseJSONIfPossible } from './LogDetails.utils';

interface IProps {
  response: ILog['response']['response'];
  isRequestPending: boolean;
}

export const useStyles = createStyles((theme) => ({
  wrapper: {
    textarea: {
      overflowY: 'clip'
    }
  }
}));

export const LogDetailsJSON = ({ response, isRequestPending }: IProps) => {
  const { classes } = useStyles();

  if (isRequestPending) {
    return (
      <Center pt={64}>
        <Text fz="md">Request pending</Text>
      </Center>
    );
  }

  if (!response) {
    return (
      <Center pt={64}>
        <Text fz="md">Nothing to Preview</Text>
      </Center>
    );
  }

  const responseJson = parseJSONIfPossible(response);
  if (responseJson.parsed) {
    const formatted = JSON.stringify(responseJson.json, null, 4);
    return <JsonInput autosize value={formatted} className={classes.wrapper} formatOnBlur />;
  }

  return (
    <div style={{ paddingLeft: 8, paddingRight: 8 }}>
      <Text fz="md">{responseJson.original}</Text>
    </div>
  );
};
