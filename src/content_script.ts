import { get } from 'lodash';
import { wildcardPattern } from 'wildcard-regex';
import { IDynamicURLMap, IEventMessage, ILog } from '@mokku/types';
import inject from './contentScript/injectToDom';
import { storeActions } from './panel/App/service/storeActions';
import messageService from './services/message';

const init = () => {
  let workspaceStore, urlMap, dynamicUrlMap: IDynamicURLMap;
  storeActions.getStore().then((a) => {
    workspaceStore = a.workspaceStore;
    urlMap = a.urlMap;
    dynamicUrlMap = a.dynamicUrlMap;
  });

  const getMockPath = (url: string, method: string) => {
    try {
      // this will moved to store.ts
      const stack = [];
      if (urlMap[url]) {
        if (urlMap[url][method]) {
          stack.push(...urlMap[url][method]);
        }
      }

      const url1 = url.replace('://', '-');
      const key = url1.split('/').length;

      let i = 0;
      while (i < key) {
        if (dynamicUrlMap[i]) {
          dynamicUrlMap[i].forEach((s) => {
            if (s.method === method) {
              const regex = wildcardPattern(s.url);
              const match = new RegExp(regex).test(url1);
              if (match) {
                stack.push(s.getterKey);
              }
            }
          });
        }
        i++;
      }

      return stack;
    } catch (error) {
      console.error('>> Error in getMockPath', error);
      return [];
    }
  };

  const updateStore = () => {
    storeActions.getStore().then((x) => {
      workspaceStore = x.workspaceStore;
      urlMap = x.urlMap;
      dynamicUrlMap = x.dynamicUrlMap;
    });
  };

  const hasGroupActive = (mock) => storeActions.isActiveGroupByMock(workspaceStore, mock);

  const isActiveSelectedMock = (mock) => {
    const hasEscenarios = storeActions.hasMultipleScenarios(workspaceStore, mock);
    if (hasEscenarios && workspaceStore.settings.enabledScenarios) {
      return mock.selected && mock.active;
    }
    return mock.active;
  };

  const getActiveMockWithPath = (paths: string[]) => {
    let mock = null;
    let path = null;
    paths.some((tempPath) => {
      const tempMock = get(workspaceStore, tempPath, null);
      if (isActiveSelectedMock(tempMock)) {
        mock = tempMock;
        path = tempPath;
        return true;
      }
      return false;
    });

    if (mock) {
      return { mock, path };
    }
    return { mock: null, path: null };
  };

  messageService.listen('CONTENT', (data: IEventMessage) => {
    if (data.type === 'LOG') {
      const message = data.message as ILog;

      const mockPaths = getMockPath(message.request.url, message.request.method);
      const { mock, path } = getActiveMockWithPath(mockPaths);

      if (mock && hasGroupActive(mock)) {
        message.isMocked = mock.active;
        message.mockPath = path;
      }

      messageService.send({
        message,
        type: 'LOG',
        from: 'CONTENT',
        to: 'PANEL'
      });
      return;
    }

    if (data.type === 'NOTIFICATION' && data.message === 'UPDATE_STORE') {
      updateStore();
      return;
    }

    const response: Omit<IEventMessage, 'type'> = {
      id: data.id,
      from: 'CONTENT',
      to: 'HOOK',
      extensionName: 'MOKKU',
      message: {}
    };

    const request = (data.message as ILog).request;
    const mockPaths = getMockPath(request.url, request.method);
    const { mock } = getActiveMockWithPath(mockPaths);

    if (mock && hasGroupActive(mock)) {
      (response.message as ILog).mockResponse = mock;
    }

    messageService.send(response);
  });
};

const host = location.host;
const isLocalhost = location.href.includes('http://localhost');

chrome.storage.local.get([`mokku.extension.active.${host}`], function (result) {
  let active = result[`mokku.extension.active.${host}`];
  if (isLocalhost && active === undefined) {
    active = true;
  }
  if (active) {
    // injects script to page's DOM
    inject();
    init();
  }
  // tell the panel about the new injection (host might have changed)
  messageService.send({
    message: host,
    type: 'INIT',
    from: 'CONTENT',
    to: 'PANEL'
  });
});
