import * as React from "react";
import * as Sentry from "@sentry/react";
import { createRoot } from "react-dom/client";

import "../dashboard/index.scss";
import { MultipleTabsSelector } from "./App_New/MultipleTabsSelector";
import { AppLoader } from "./App_New/AppLoader";

// enable sentry
Sentry.init({
  dsn:
    "https://295710d47ec2a821111e6d0c6542417d@o4505806318469120.ingest.sentry.io/4505806320697344",
  integrations: [new Sentry.Replay()],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

/**
 * case:
 * http://
 * https://
 * then till next /
 */
export const getDomain = (url: string) => {
  if (!url) {
    return "";
  }
  let domain = url;
  domain = domain.replace("https://", "");
  domain = domain.replace("http://", "");
  domain = domain.replace("https://", "");
  domain = domain.replace("http://", "");
  const domainLastIndex = domain.indexOf("/");
  if (domainLastIndex !== -1) {
    domain = domain.substr(0, domainLastIndex);
  }
  return domain;
};

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (tab) {
    root.render(<AppLoader tab={tab} />);
  } else {
    // mokku is loaded as separate window
    // there can we multiple windows which have active tabs
    // let the user select the right tab as we can't figure this out
    chrome.tabs.query({ active: true, currentWindow: false }, (tabs) => {
      root.render(<MultipleTabsSelector tabs={tabs} />);
    });
  }
});
