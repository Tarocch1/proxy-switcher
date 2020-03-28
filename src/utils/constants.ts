import { IProxyFormData } from '../types';

export const DEFAULT_PROXY_FORMDATA: IProxyFormData = {
  id: '',
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
};

export const MESSAGE_TYPE = {
  SET_HTTP_AUTH: 'SET_HTTP_AUTH',
  UNSET_HTTP_AUTH: 'UNSET_HTTP_AUTH',
};
