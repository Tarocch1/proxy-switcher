import { ShowMode, IProxyFormData } from '../types';
import { storageGetSync, storageSetSync } from '../utils/storage';
import { proxyGetSync, proxySetSync, proxyClearSync, formDataToConfig } from '../utils/proxy';
import { DEFAULT_PROXY_CONFIG } from '../utils/constants';

class MainModel {
  init: boolean = false;

  controllableByThisExtension: boolean = false;

  showMode: ShowMode = 'list';

  proxyList: IProxyFormData[] = [];

  currentProxy: string = '';

  edittingProxy: IProxyFormData = {
    id: '',
    name: '',
    mode: 'fixed_servers',
    ...DEFAULT_PROXY_CONFIG,
  };

  async getControllableByThisExtension() {
    const proxySetting = await proxyGetSync({});
    this.controllableByThisExtension = proxySetting.levelOfControl.includes('this_extension');
    this.init = true;
  }

  setShowMode(payload: ShowMode) {
    this.showMode = payload;
  }

  async setProxyList(payload: IProxyFormData[]) {
    await storageSetSync({
      proxyList: payload,
    });
    this.proxyList = payload;
  }

  async getProxyList() {
    const data = await storageGetSync(['proxyList']);
    if (data.proxyList) this.proxyList = data.proxyList;
  }

  async getCurrentProxy() {
    const data = await storageGetSync(['currentProxy']);
    if (data.currentProxy) this.currentProxy = data.currentProxy;
  }

  async setCurrentProxy(payload: string) {
    await storageSetSync({ currentProxy: payload });
    const formData = this.proxyList.find(proxy => proxy.id === payload);
    const proxyConfig = formDataToConfig(formData!);
    await proxySetSync({
      scope: 'regular',
      value: proxyConfig,
    });
    this.currentProxy = payload;
  }

  setEdittingProxy(payload: IProxyFormData) {
    this.edittingProxy = payload;
  }

  resetEdittingProxy() {
    this.edittingProxy = {
      id: '',
      name: '',
      mode: 'fixed_servers',
      ...DEFAULT_PROXY_CONFIG,
    };
  }

  async createProxy(data: IProxyFormData) {
    const list = [...this.proxyList];
    list.push(data);
    await storageSetSync({
      proxyList: list,
    });
    this.proxyList = list;
  }

  async editProxy(data: IProxyFormData) {
    const list = [...this.proxyList];
    const index = list.findIndex(proxy => proxy.id === data.id);
    list[index] = data;
    await storageSetSync({
      proxyList: list,
    });
    this.proxyList = list;
    if (this.currentProxy === data.id) {
      this.setCurrentProxy(data.id);
    }
  }

  async deleteProxy(id: string) {
    const list = [...this.proxyList];
    const index = list.findIndex(proxy => proxy.id === id);
    list.splice(index, 1);
    await storageSetSync({
      proxyList: list,
    });
    if (this.currentProxy === id) {
      await storageSetSync({
        currentProxy: '',
      });
      await proxyClearSync({
        scope: 'regular',
      });
      this.currentProxy = '';
    }
    this.proxyList = list;
  }

  async clearProxy() {
    await storageSetSync({
      currentProxy: '',
    });
    await proxyClearSync({
      scope: 'regular',
    });
    this.currentProxy = '';
  }
}

export default MainModel;
