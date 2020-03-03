import { ProxyScheme } from '../types';

export const DEFAULT_PROXY_CONFIG: {
  scheme: ProxyScheme;
  host: string;
  port: number | null;
  bypassList: string;
} = {
  scheme: 'http',
  host: '',
  port: null,
  bypassList: '',
};
