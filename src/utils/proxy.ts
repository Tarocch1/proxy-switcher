import { IProxyFormData } from '../types';

export function proxyGetSync(details: chrome.types.ChromeSettingGetDetails) {
  return new Promise<chrome.types.ChromeSettingGetResultDetails>(resolve => {
    chrome.proxy.settings.get(details, resolve);
  });
}

export function proxySetSync(details: chrome.types.ChromeSettingSetDetails) {
  return new Promise<void>(resolve => {
    chrome.proxy.settings.set(details, resolve);
  });
}

export function proxyClearSync(details: chrome.types.ChromeSettingClearDetails) {
  return new Promise<void>(resolve => {
    chrome.proxy.settings.clear(details, resolve);
  });
}

export function formDataToConfig(data: IProxyFormData): chrome.proxy.ProxyConfig {
  let proxyConfig: chrome.proxy.ProxyConfig = {
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
