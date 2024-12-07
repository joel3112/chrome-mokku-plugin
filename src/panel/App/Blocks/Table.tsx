import React from "react";
import { createStyles, rem, Table } from "@mantine/core";
import { MockType } from "../types/mock";

export type TableSchema<T> = Array<{
  header: React.ReactNode;
  style?: React.CSSProperties;
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
    background: `${
      theme.colorScheme === "dark" ? "#080808" : theme.colors.gray[2]
    }`,
  },
  selectedRow: {
    background: `${
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors.blue[7], 0.25)
        : theme.colors.blue[0]
    } !important`,
  },
  rows: {
    height: 50,
    "&:hover": {
      cursor: "pointer",
    },
  },
  th: {
    background:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  table: {
    position: "relative",
    borderCollapse: "collapse",
    width: "100%",
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
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
      {schema.map(({ header, minWidth, maxWidth, width, style }, index) => (
        <th
          style={{ minWidth, maxWidth, width, ...style }}
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
        {schema.map(({ content, maxWidth, style }, index) => (
          <td key={index} style={{ maxWidth, ...style }}>
            {content(row)}
          </td>
        ))}
      </tr>
    );
  });

  return (
    <Table captionSide="bottom" highlightOnHover className={classes.table}>
      <thead>{ths}</thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};
