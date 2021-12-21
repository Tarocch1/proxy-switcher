import { v4 as uuidV4 } from 'uuid'

export enum ProxyMode {
  direct = 'direct',
  pac_script = 'pac_script',
  fixed_servers = 'fixed_servers',
}

export enum ProxyScheme {
  http = 'http',
  https = 'https',
  quic = 'quic',
  socks4 = 'socks4',
  socks5 = 'socks5',
}

export type ProxyFormData = {
  id: string
  name: string
  mode: ProxyMode
  scheme: ProxyScheme
  host: string
  port: number | ''
  username: string
  password: string
  bypassList: string
  pacUrl: string
  pacScript: string
}

export function proxyGetSync(details: chrome.types.ChromeSettingGetDetails) {
  return new Promise<chrome.types.ChromeSettingGetResultDetails>((resolve) => {
    chrome.proxy.settings.get(details, resolve)
  })
}

export function proxySetSync(details: chrome.types.ChromeSettingSetDetails) {
  return new Promise<void>((resolve) => {
    chrome.proxy.settings.set(details, resolve)
  })
}

export function proxyClearSync(
  details: chrome.types.ChromeSettingClearDetails
) {
  return new Promise<void>((resolve) => {
    chrome.proxy.settings.clear(details, resolve)
  })
}

export async function controllableByThisExtension() {
  const proxySetting = await proxyGetSync({})
  return proxySetting.levelOfControl.includes('this_extension')
}

export class Proxy {
  config: ProxyFormData

  constructor(private form: ProxyFormData) {
    this.config = this.format(this.form)
  }

  static default(): ProxyFormData {
    return {
      id: uuidV4(),
      name: '',
      mode: ProxyMode.fixed_servers,
      scheme: ProxyScheme.http,
      host: '',
      port: '',
      username: '',
      password: '',
      bypassList: '',
      pacUrl: '',
      pacScript: '',
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static valid(data: any): data is ProxyFormData {
    if (!(Object.prototype.toString.call(data) === '[object Object]')) {
      return false
    }
    if (typeof data.id !== 'string') return false
    if (typeof data.name !== 'string') return false
    if (!Object.values(ProxyMode).includes(data.mode)) return false
    if (!Object.values(ProxyScheme).includes(data.scheme)) return false
    if (typeof data.host !== 'string') return false
    if (typeof data.port !== 'number' && data.port !== '') return false
    if (typeof data.username !== 'string') return false
    if (typeof data.password !== 'string') return false
    if (typeof data.bypassList !== 'string') return false
    if (typeof data.pacUrl !== 'string') return false
    if (typeof data.pacScript !== 'string') return false
    return true
  }

  private format(proxyFormData: ProxyFormData): ProxyFormData {
    let keys: Array<keyof ProxyFormData> = []

    if (proxyFormData.mode === ProxyMode.direct) {
      keys = ['id', 'name', 'mode']
    } else if (proxyFormData.mode === ProxyMode.pac_script) {
      keys = ['id', 'name', 'mode', 'pacScript', 'pacUrl']
    } else if (
      [ProxyScheme.http, ProxyScheme.https].includes(proxyFormData.scheme)
    ) {
      keys = [
        'id',
        'name',
        'mode',
        'scheme',
        'host',
        'port',
        'username',
        'password',
        'bypassList',
      ]
    } else {
      keys = ['id', 'name', 'mode', 'scheme', 'host', 'port', 'bypassList']
    }

    return {
      ...Proxy.default(),
      ...Object.fromEntries(
        Object.entries(proxyFormData).filter(([key]) =>
          keys.includes(key as keyof ProxyFormData)
        )
      ),
    }
  }

  toProxyConfig(): chrome.proxy.ProxyConfig {
    let proxyConfig: chrome.proxy.ProxyConfig = {
      mode: 'system',
    }
    switch (this.config.mode) {
      case 'direct':
        proxyConfig = {
          mode: 'direct',
        }
        break
      case 'fixed_servers': {
        const bypassList = this.config.bypassList
          .replace(/\r/g, '\n')
          .replace(/\n+/g, '\n')
        proxyConfig = {
          mode: 'fixed_servers',
          rules: {
            singleProxy: {
              scheme: this.config.scheme,
              host: this.config.host,
              port: this.config.port as number,
            },
            bypassList: bypassList.split('\n'),
          },
        }
        break
      }
      case 'pac_script':
        proxyConfig = {
          mode: 'pac_script',
          pacScript: {
            ...(this.config.pacUrl
              ? {
                  url: this.config.pacUrl,
                }
              : {
                  data: this.config.pacScript,
                }),
            mandatory: false,
          },
        }
        break
      default:
        break
    }
    return proxyConfig
  }
}
