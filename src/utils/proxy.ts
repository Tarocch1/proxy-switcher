import { v4 as uuidV4 } from 'uuid'

export type ProxyMode = 'direct' | 'pac_script' | 'fixed_servers'
export type ProxyScheme = 'http' | 'https' | 'quic' | 'socks4' | 'socks5'

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

export class Proxy {
  config: ProxyFormData

  constructor(private form: ProxyFormData) {
    this.config = this.format(this.form)
  }

  static default(): ProxyFormData {
    return {
      id: uuidV4(),
      name: '',
      mode: 'fixed_servers',
      scheme: 'http',
      host: '',
      port: '',
      username: '',
      password: '',
      bypassList: '',
      pacUrl: '',
      pacScript: '',
    }
  }

  private format(proxyFormData: ProxyFormData): ProxyFormData {
    let keys: Array<keyof ProxyFormData> = []

    if (proxyFormData.mode === 'direct') {
      keys = ['id', 'name', 'mode']
    } else if (proxyFormData.mode === 'pac_script') {
      keys = ['id', 'name', 'mode', 'pacScript', 'pacUrl']
    } else if (['http', 'https'].includes(proxyFormData.scheme)) {
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
}
