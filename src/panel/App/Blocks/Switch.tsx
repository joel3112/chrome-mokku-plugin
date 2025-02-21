import React, { ComponentProps, useState } from 'react';
import { Switch as SwitchBase } from '@mantine/core';

export const Switch = (props: ComponentProps<typeof SwitchBase>) => {
  const [active, setActive] = useState(props.checked);

  return (
    <SwitchBase
      {...props}
      checked={active}
      onChange={(x) => {
        setActive(x.target.checked);
        props.onChange?.(x);
      }}
      styles={(theme) => ({
        track: {
          backgroundColor: 'transparent !important'
        },
        thumb: {
          backgroundColor: active
            ? `${theme.colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[6]}`
            : 'white',
          borderColor: active
            ? `${theme.colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[6]} !important`
            : 'white'
        }
      })}
    />
  );
};
