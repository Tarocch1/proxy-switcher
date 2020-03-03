export type ShowMode = 'list' | 'edit';
export type ProxyMode = 'direct' | 'auto_detect' | 'pac_script' | 'fixed_servers' | 'system';
export type ProxyScheme = 'http' | 'https' | 'quic' | 'socks4' | 'socks5';

export interface IProxyServer {
  scheme: ProxyScheme;
  host: string;
  port: number;
}

export interface IProxyRules {
  singleProxy: IProxyServer;
  bypassList?: string[];
}

export interface IProxyConfig {
  mode: ProxyMode;
  rules?: IProxyRules;
}

export interface IProxyFormData {
  id: string;
  name: string;
  mode: ProxyMode;
  scheme: ProxyScheme;
  host: string;
  port: number | null;
  bypassList: string;
}
