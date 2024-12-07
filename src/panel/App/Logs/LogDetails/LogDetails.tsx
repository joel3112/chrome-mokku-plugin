import React from 'react';
import { Card, Flex, Tabs, TextInput, createStyles, rem } from '@mantine/core';
import { ILog } from '@mokku/types';
import { SideDrawer } from '../../Blocks/SideDrawer';
import { LogDetailsHeader } from './LogDetails.Header';
import { LogDetailsJSON } from './LogDetails.JSON';

interface IProps {
  log: ILog;
  onClose: () => void;
}

const useStyles = createStyles((theme) => ({
  tabList: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  panel: {
    flexGrow: 2,
    padding: '0 !important',
    overflow: 'auto'
  },
  tabs: {
    height: '100%'
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    background: 'transparent',
    height: '100%',
    borderRadius: 0
  },
  wrapper: {
    height: '100%',
    overflow: 'auto',
    paddingBlock: 12,
    paddingInline: 20,
    'label:not([class*=SegmentedControl])': {
      fontSize: rem(13),
      marginBottom: 4
    },
    textarea: {
      overflowY: 'clip'
    }
  },
  jsonWrapper: {
    maxWidth: '100%'
  }
}));

export const LogDetails = ({ log }: IProps) => {
  const { classes } = useStyles();

  return (
    <SideDrawer minWidth={520}>
      <Card className={classes.card} p={0}>
        <Flex direction="column" gap={16} className={classes.wrapper}>
          <TextInput label="URL" readOnly value={log.request?.url} />

          <Tabs defaultValue="response" className={classes.tabs}>
            <Flex style={{ height: '100%' }} direction="column">
              <Tabs.List className={classes.tabList}>
                <Flex>
                  <Tabs.Tab value="response">Response</Tabs.Tab>
                  <Tabs.Tab value="requestBody">Request Body</Tabs.Tab>
                  <Tabs.Tab value="queryParams">Query Params</Tabs.Tab>
                  <Tabs.Tab value="headers">Headers</Tabs.Tab>
                </Flex>
              </Tabs.List>

              <Tabs.Panel className={classes.panel} value="response" pt="xs">
                <div className={classes.jsonWrapper}>
                  <LogDetailsJSON
                    id="response"
                    isRequestPending={!log?.response?.response}
                    response={log?.response?.response}
                  />
                </div>
              </Tabs.Panel>
              <Tabs.Panel className={classes.panel} value="requestBody" pt="xs">
                <div className={classes.jsonWrapper}>
                  <LogDetailsJSON
                    id="request-body"
                    isRequestPending={!log?.response?.response}
                    response={log?.request?.body}
                  />
                </div>
              </Tabs.Panel>
              <Tabs.Panel className={classes.panel} value="queryParams" pt="xs">
                <div className={classes.jsonWrapper}>
                  <LogDetailsJSON
                    id="request-params"
                    isRequestPending={!log?.response?.response}
                    response={log?.request?.queryParams}
                  />
                </div>
              </Tabs.Panel>
              <Tabs.Panel className={classes.panel} value="headers" pt="xs">
                <LogDetailsHeader
                  responseHeaders={log?.response?.headers}
                  requestHeaders={log?.request?.headers}
                />
              </Tabs.Panel>
            </Flex>
          </Tabs>
        </Flex>
      </Card>
    </SideDrawer>
  );
};
