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
      onLabel="ON"
      offLabel="OFF"
    />
  );
};
