import { IProxyFormData } from '../types';

export const DEFAULT_PROXY_FORMDATA: IProxyFormData = {
  id: '',
  name: '',
  mode: 'fixed_servers',
  scheme: 'http',
  host: '',
  port: null,
  bypassList: '',
  pacUrl: '',
  pacScript: '',
};
