import { ProxyFormData } from './proxy'
import { eventEmitter, STORAGE_CHANGED } from './event'

type Storages = {
  proxy: { [id: string]: ProxyFormData }
  current: string
}

class Storage {
  private keys = ['proxy', 'current']
  private storages: Storages = {
    current: '',
    proxy: {},
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

  addOrEditProxy(proxy: ProxyFormData) {
    chrome.storage.sync.set({
      proxy: {
        ...this.proxy,
        [proxy.id]: proxy,
      },
    })
  }

  deleteProxy(id: string) {
    chrome.storage.sync.set({
      proxy: Object.fromEntries(
        Object.entries(this.proxy).filter(([_id]) => _id !== id)
      ),
    })
  }
}

export const storage = new Storage()
