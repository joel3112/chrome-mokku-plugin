import React from 'react';
import { Center, Text } from '@mantine/core';
import { ILog } from '@mokku/types';
import { JsonEditor } from '../../Blocks/JsonEditor';
import { parseJSONIfPossible } from './LogDetails.utils';

interface IProps {
  response: ILog['response']['response'];
  isRequestPending: boolean;
}

export const LogDetailsJSON = ({ response, isRequestPending }: IProps) => {
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
    const formatted = JSON.stringify(responseJson.json, null, 2);
    return <JsonEditor value={formatted} formatOnBlur />;
  }

  return (
    <div style={{ paddingLeft: 8, paddingRight: 8 }}>
      <Text fz="md">{responseJson.original}</Text>
    </div>
  );
};
