import { ShowMode, IProxyFormData } from '../types';
import { storageGetSync, storageSetSync } from '../utils/storage';
import { proxyGetSync, proxySetSync, proxyClearSync, formDataToConfig } from '../utils/proxy';
import { DEFAULT_PROXY_FORMDATA, MESSAGE_TYPE } from '../utils/constants';

class MainModel {
  init: boolean = false;

  controllableByThisExtension: boolean = false;

  showMode: ShowMode = 'list';

  proxyList: IProxyFormData[] = [];

  currentProxy: string = '';

  edittingProxy: IProxyFormData = DEFAULT_PROXY_FORMDATA;

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
    const formData = this.proxyList.find(proxy => proxy.id === payload);
    if (
      formData?.mode === 'fixed_servers' &&
      formData.scheme.includes('http') &&
      formData.username &&
      formData.password
    ) {
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPE.SET_HTTP_AUTH,
        payload: {
          username: formData.username,
          password: formData.password,
        },
      });
    } else {
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPE.UNSET_HTTP_AUTH,
      });
    }
    const proxyConfig = formDataToConfig(formData!);
    await proxySetSync({
      scope: 'regular',
      value: proxyConfig,
    });
    await storageSetSync({ currentProxy: payload });
    this.currentProxy = payload;
  }

  setEdittingProxy(payload: IProxyFormData) {
    this.edittingProxy = payload;
  }

  resetEdittingProxy() {
    this.edittingProxy = DEFAULT_PROXY_FORMDATA;
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
      this.clearProxy();
    }
    this.proxyList = list;
  }

  async clearProxy() {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPE.UNSET_HTTP_AUTH,
    });
    await proxyClearSync({
      scope: 'regular',
    });
    await storageSetSync({
      currentProxy: '',
    });
    this.currentProxy = '';
  }
}

export default MainModel;
