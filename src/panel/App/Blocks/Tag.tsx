import { IMockResponse, MethodEnum } from "../types";
import { Badge } from "@mantine/core";
import React from "react";

export const MethodTag = ({ method }: Pick<IMockResponse, "method">) => {
  const colorByMethod = {
    [MethodEnum.GET]: "blue",
    [MethodEnum.POST]: "green",
    [MethodEnum.PUT]: "orange",
    [MethodEnum.PATCH]: "yellow",
    [MethodEnum.DELETE]: "red",
  };

  return (
    <Badge color={colorByMethod[method]} variant="dot" radius="sm" size="sm">
      {method}
    </Badge>
  );
};

export const StatusTag = ({
  status,
  onClick,
}: Pick<IMockResponse, "status"> & {
  onClick?: () => void;
}) => {
  const initialNumber = Math.floor(status / 100).toString();
  const colorByNumber = {
    1: "blue",
    2: "green",
    3: "violet",
    4: "yellow",
    5: "red",
  };

  return (
    <Badge
      color={colorByNumber[initialNumber]}
      radius="sm"
      size="sm"
      onClick={onClick}
    >
      {status}
    </Badge>
  );
};
