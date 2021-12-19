import { Proxy, ProxyFormData } from './proxy'
import { eventEmitter, STORAGE_CHANGED } from './event'

type Storages = {
  proxy: ProxyFormData[]
  current: string
}

class Storage {
  private keys = ['proxy', 'current']
  private storages: Storages = {
    current: '',
    proxy: [],
  }

  constructor() {
    chrome.storage.onChanged.addListener(this.init.bind(this))
  }

  async init() {
    const storages = (await chrome.storage.sync.get(this.keys)) as Storages
    this.storages = {
      ...this.storages,
      ...storages,
    }
    eventEmitter.emit(STORAGE_CHANGED, this.storages)
  }

  get current() {
    return this.storages.current
  }

  set current(id: string) {
    chrome.storage.sync.set({
      current: id,
    })
  }

  get proxy() {
    return this.storages.proxy
  }

  set proxy(proxy: ProxyFormData[]) {
    chrome.storage.sync.set({
      proxy,
    })
  }

  addOrEditProxy(proxyFormData: ProxyFormData) {
    const p = new Proxy(proxyFormData)
    const index = this.proxy.findIndex((_p) => _p.id === p.config.id)
    const proxy = [...this.proxy]
    if (index > -1) {
      proxy[index] = p.config
    } else {
      proxy.push(p.config)
    }
    this.proxy = proxy
  }

  deleteProxy(id: string) {
    chrome.storage.sync.set({
      proxy: this.proxy.filter((proxy) => proxy.id !== id),
    })
  }
}

export const storage = new Storage()
