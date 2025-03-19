import React, { ReactNode, useEffect, useRef } from 'react';
import { Flex, createStyles } from '@mantine/core';

const MIN_WIDTH = 240;

const useStyles = createStyles((theme) => ({
  wrapper: {
    overflow: 'auto'
  },
  dragger: {
    flexShrink: 0,
    width: 2,
    height: '100%',
    background: 'transparent',
    cursor: 'col-resize',
    '&:hover': {
      background: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[6]
    }
  },
  container: {
    flexGrow: 2,
    height: '100%',
    minWidth: MIN_WIDTH
  },
  dots: {
    background: theme.colors.gray[5],
    borderRadius: '50%',
    width: 2,
    height: 2
  },
  header: {
    padding: '12px 12px 12px 16px',
    height: 44,
    flexShrink: 0,
    background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    width: '100%'
  }
}));

export const SideDrawer = ({
  children,
  minWidth = 520
}: {
  children: ReactNode;
  minWidth?: number;
}) => {
  const { classes } = useStyles();
  const draggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDraggerMouseMove = (event) => {
    const mousePosition = event.clientX;
    const elementRightEdge = containerRef.current.getBoundingClientRect().right;
    const width = Math.max(minWidth || MIN_WIDTH, elementRightEdge - mousePosition);
    containerRef.current.style.width = `${width}px`;
  };

  const onDraggerMouseUp = () => {
    document.removeEventListener('mousemove', onDraggerMouseMove);
  };

  const onDraggerMouseDown = () => {
    document.addEventListener('mousemove', onDraggerMouseMove);
    document.addEventListener('mouseup', onDraggerMouseUp);
  };

  useEffect(() => {
    draggerRef.current?.addEventListener('mousedown', onDraggerMouseDown);
    const containerWidth = Math.min(Math.max(minWidth || MIN_WIDTH), window.innerWidth - 48);
    containerRef.current.style.width = `${containerWidth}px`;
  }, []);

  const finalMinWidth = Math.min(minWidth, window.innerWidth - 48);

  return (
    <Flex id="side-drawer" className={classes.wrapper}>
      <div id="dragger" ref={draggerRef} className={classes.dragger} />
      <div ref={containerRef} className={classes.container} style={{ minWidth: finalMinWidth }}>
        {children}
      </div>
    </Flex>
  );
};
