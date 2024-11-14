import React from "react";
import { createStyles, Table } from "@mantine/core";
import { MockType } from "../types/mock";

export type TableSchema<T> = Array<{
  header: string;
  content: (data: T) => React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
}>;

export interface TableWrapperProps<T> {
  schema: TableSchema<T>;
  data: T[];
  onRowClick?: (data: T) => void;
  selectedRowId?: number | string;
}

const useStyles = createStyles((theme) => ({
  groupRow: {
    background: `${theme.colors.gray[0]}`,
    ...(theme.colorScheme === "dark"
      ? {
          background: theme.colors.dark[9],
        }
      : {}),
  },
  selectedRow: {
    background: `${theme.colors[theme.primaryColor][3]} !important`,
    ...(theme.colorScheme === "dark"
      ? {
          color: theme.black,
        }
      : {}),
    "&:hover": {
      background: `${theme.colors[theme.primaryColor][3]} !important`,
      ...(theme.colorScheme === "dark"
        ? {
            color: theme.black,
          }
        : {}),
    },
  },
  rows: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  th: {
    background:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    position: "sticky",
    top: 0,
    borderBottom: "1px solid black",
  },
}));

export const TableWrapper = <
  T extends unknown & {
    id: string | number;
    type?: MockType;
    groupId?: string;
    expanded?: boolean;
  }
>({
  schema,
  data,
  onRowClick,
  selectedRowId,
}: TableWrapperProps<T>) => {
  const { classes } = useStyles();

  const ths = (
    <tr>
      {schema.map(({ header, minWidth, maxWidth, width }, index) => (
        <th
          style={{ minWidth, maxWidth, width }}
          key={index}
          className={classes.th}
        >
          {header}
        </th>
      ))}
    </tr>
  );

  const rows = data.map((row, index) => {
    const rowMockHasGroup = row.type !== MockType.GROUP && row.groupId;

    if (rowMockHasGroup) {
      const hasGroupExpanded = data.find((item) => item.id === row.groupId)
        ?.expanded;
      if (hasGroupExpanded === false) {
        return null;
      }
    }

    return (
      <tr
        key={`row-${index}`}
        onClick={() => {
          onRowClick(row);
        }}
        className={`${selectedRowId === row.id ? classes.selectedRow : ""} ${
          rowMockHasGroup ? classes.groupRow : ""
        } ${classes.rows}`}
      >
        {schema.map(({ content }, index) => (
          <td key={index}>{content(row)}</td>
        ))}
      </tr>
    );
  });

  return (
    <Table
      captionSide="bottom"
      highlightOnHover
      style={{ position: "relative" }}
    >
      <thead>{ths}</thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};
