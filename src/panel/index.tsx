import * as React from 'react';
import { createRoot } from 'react-dom/client';
import '../dashboard/index.scss';
import { AppLoader } from './App/AppLoader';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  root.render(<AppLoader tab={tab} />);
  // if (tab) {
  // } else {
  //   // mokku is loaded as separate window
  //   // there can we multiple windows which have active tabs
  //   // let the user select the right tab as we can't figure this out
  //   chrome.tabs.query({ active: true, currentWindow: false }, (tabs) => {
  //     root.render(<MultipleTabsSelector tabs={tabs} />);
  //   });
  // }
});
