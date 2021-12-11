import { v4 as uuidV4 } from 'uuid'

export type ProxyMode =
  | 'direct'
  | 'auto_detect'
  | 'pac_script'
  | 'fixed_servers'
  | 'system'
export type ProxyScheme = 'http' | 'https' | 'quic' | 'socks4' | 'socks5'

export type ProxyFormData = {
  id: string
  name: string
  mode: ProxyMode
  scheme: ProxyScheme
  host: string
  port: number | null
  username: string
  password: string
  bypassList: string
  pacUrl: string
  pacScript: string
}

export class Proxy {
  constructor(private form: ProxyFormData) {}

  static default(): ProxyFormData {
    return {
      id: uuidV4(),
      name: '',
      mode: 'fixed_servers',
      scheme: 'http',
      host: '',
      port: null,
      username: '',
      password: '',
      bypassList: '',
      pacUrl: '',
      pacScript: '',
    }
  }
}
