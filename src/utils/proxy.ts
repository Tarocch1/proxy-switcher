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
    case 'direct':
      proxyConfig = {
        mode: 'direct',
      };
      break;
    case 'fixed_servers':
      let bypassList = data.bypassList;
      bypassList = bypassList.replace(/\r/g, '\n');
      bypassList = bypassList.replace(/\n+/g, '\n');
      proxyConfig = {
        mode: 'fixed_servers',
        rules: {
          singleProxy: {
            scheme: data.scheme,
            host: data.host,
            port: data.port!,
          },
          bypassList: bypassList.split('\n'),
        },
      };
      break;
    case 'pac_script':
      proxyConfig = {
        mode: 'pac_script',
        pacScript: {
          ...(data.pacUrl
            ? {
                url: data.pacUrl,
              }
            : {
                data: data.pacScript,
              }),
          mandatory: false,
        },
      };
      break;
    default:
      break;
  }
  return proxyConfig;
}
