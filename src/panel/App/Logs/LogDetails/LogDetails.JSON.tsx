import React from 'react';
import { Center, Code } from '@mantine/core';
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
        <Code fz={12} bg="transparent">
          Request pending
        </Code>
      </Center>
    );
  }

  if (!response) {
    return (
      <Center pt={64}>
        <Code fz={12} bg="transparent">
          Nothing to Preview
        </Code>
      </Center>
    );
  }

  const responseJson = parseJSONIfPossible(response);
  if (responseJson.parsed) {
    const formatted = JSON.stringify(responseJson.json, undefined, 2);
    return <JsonEditor value={formatted} readOnly />;
  }

  return <JsonEditor value={''} readOnly />;
};
