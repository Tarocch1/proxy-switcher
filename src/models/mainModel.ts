import { ShowMode, IProxyFormData } from '../types';
import { storageGetSync, storageSetSync } from '../utils/storage';

class MainModel {
  showMode: ShowMode = 'list';

  proxyList: IProxyFormData[] = [];

  currentProxy: string = '';

  setShowMode = (payload: ShowMode) => {
    this.showMode = payload;
  };

  getProxyList = async () => {
    const data = await storageGetSync(['proxyList']);
    if (data.proxyList) this.proxyList = data.proxyList;
  };

  getCurrentProxy = async () => {
    const data = await storageGetSync(['currentProxy']);
    if (data.currentProxy) this.proxyList = data.currentProxy;
  };

  setCurrentProxy = async (payload: string) => {
    await storageSetSync({ currentProxy: payload });
    this.currentProxy = payload;
  };
}

export default new MainModel();
