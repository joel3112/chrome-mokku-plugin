import React from 'react';
import { Center, Code } from '@mantine/core';
import { transformArrayQueryParamsToObjectString } from '../Mocks/AddMock/AddMock.utils';
import { MockHeaders } from './MockHeaders';

type MockQueryParamsProps = {
  queryParams: string;
  readOnly?: boolean;
  onChange?: (queryParams: string) => void;
};

const buildQueryParams = (queryParams: string) => {
  try {
    return Object.entries(JSON.parse(queryParams)).map(([name, value]) => ({
      name,
      value: String(value)
    }));
  } catch (error) {
    console.error('Error parsing query params:', error);
    return [];
  }
};

export const MockQueryParams = ({ queryParams, readOnly, onChange }: MockQueryParamsProps) => {
  const result = React.useMemo(() => buildQueryParams(queryParams), [queryParams]);

  if (readOnly && result?.length === 0) {
    return (
      <Center pt={6}>
        <Code fz={12} bg="transparent">
          No Query Params
        </Code>
      </Center>
    );
  }

  return (
    <MockHeaders
      headers={result}
      buttonAddText="Add Query Param"
      readOnly={readOnly}
      onChange={(headers) => {
        if (onChange) {
          const result = transformArrayQueryParamsToObjectString(headers);
          onChange(result);
        }
      }}
    />
  );
};
