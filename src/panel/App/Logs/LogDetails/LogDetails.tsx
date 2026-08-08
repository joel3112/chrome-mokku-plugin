import React from 'react';
import { Card, Flex, Tabs, TextInput, createStyles, rem } from '@mantine/core';
import { ILog } from '@mokku/types';
import { MockHeaders } from '../../Blocks/MockHeaders';
import { MockQueryParams } from '../../Blocks/MockQueryParams';
import { SectionTabs } from '../../Blocks/SectionTabs';
import { SideDrawer } from '../../Blocks/SideDrawer';
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
    overflow: 'auto',
    marginTop: 10
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
    paddingTop: 16,
    paddingBottom: 28,
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
    <SideDrawer>
      <Card className={classes.card} p={0}>
        <Flex direction="column" gap={16} className={classes.wrapper}>
          <TextInput label="URL" readOnly value={log.request?.urlWithQueryParams} />

          <SectionTabs defaultValue="response" className={classes.tabs} mt={10}>
            <Tabs.List>
              <Tabs.Tab value="response">Response</Tabs.Tab>
              <Tabs.Tab value="request">Request</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel pt="xs" value="response">
              <Tabs defaultValue="responseBody" className={classes.tabs}>
                <Flex style={{ height: '100%' }} direction="column">
                  <Tabs.List className={classes.tabList}>
                    <Flex>
                      <Tabs.Tab value="responseBody">Body</Tabs.Tab>
                      <Tabs.Tab value="responseHeaders">Headers</Tabs.Tab>
                    </Flex>
                  </Tabs.List>

                  <Tabs.Panel className={classes.panel} value="responseBody" pt="xs">
                    <div className={classes.jsonWrapper}>
                      <LogDetailsJSON
                        isRequestPending={!log?.response?.response}
                        response={log?.response?.response}
                      />
                    </div>
                  </Tabs.Panel>
                  <Tabs.Panel className={classes.panel} value="responseHeaders" pt="xs">
                    <MockHeaders headers={log?.response?.headers} readOnly />
                  </Tabs.Panel>
                </Flex>
              </Tabs>
            </Tabs.Panel>

            <Tabs.Panel pt="xs" value="request">
              <Tabs defaultValue="requestBody" className={classes.tabs}>
                <Flex style={{ height: '100%' }} direction="column">
                  <Tabs.List className={classes.tabList}>
                    <Flex>
                      <Tabs.Tab value="requestBody">Payload</Tabs.Tab>
                      <Tabs.Tab value="requestQueryParams">Query Params</Tabs.Tab>
                      <Tabs.Tab value="requestHeaders">Headers</Tabs.Tab>
                    </Flex>
                  </Tabs.List>

                  <Tabs.Panel className={classes.panel} value="requestBody" pt="xs">
                    <div className={classes.jsonWrapper}>
                      <LogDetailsJSON
                        isRequestPending={!log?.response?.response}
                        response={log?.request?.body}
                      />
                    </div>
                  </Tabs.Panel>
                  <Tabs.Panel className={classes.panel} value="requestQueryParams" pt="xs">
                    <MockQueryParams queryParams={log?.request?.queryParams} readOnly />
                  </Tabs.Panel>
                  <Tabs.Panel className={classes.panel} value="requestHeaders" pt="xs">
                    <MockHeaders headers={log?.request?.headers} readOnly />
                  </Tabs.Panel>
                </Flex>
              </Tabs>
            </Tabs.Panel>
          </SectionTabs>
        </Flex>
      </Card>
    </SideDrawer>
  );
};
