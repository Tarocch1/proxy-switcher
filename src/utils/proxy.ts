import { IProxyConfig, IProxyFormData } from '../types';

export function proxyGetSync(details: { incognito?: boolean }) {
  return new Promise<{ [key: string]: any }>(resolve => {
    chrome.proxy.settings.get(details, resolve);
  });
}

export function proxySetSync(details: { value: IProxyConfig; scope?: string }) {
  return new Promise<void>(resolve => {
    chrome.proxy.settings.set(details, resolve);
  });
}

export function proxyClearSync(details: { scope?: string }) {
  return new Promise<void>(resolve => {
    chrome.proxy.settings.clear(details, resolve);
  });
}

export function formDataToConfig(data: IProxyFormData): IProxyConfig {
  let proxyConfig: IProxyConfig = {
    mode: 'system',
  };
  switch (data.mode) {
    case 'system':
    case 'direct':
      proxyConfig = {
        mode: data.mode,
      };
      break;
    case 'fixed_servers':
      proxyConfig = {
        mode: 'fixed_servers',
        rules: {
          singleProxy: {
            scheme: data.scheme,
            host: data.host,
            port: data.port!,
          },
          bypassList: data.bypassList.split(','),
        },
      };
      break;
    default:
      break;
  }
  return proxyConfig;
}
