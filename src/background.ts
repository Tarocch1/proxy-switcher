import { Storages } from '@/utils/storage'
import { Proxy, proxySetSync, proxyClearSync } from '@/utils/proxy'

const keys = ['proxy', 'current']

chrome.storage.onChanged.addListener(async function () {
  const { current, proxy } = (await chrome.storage.sync.get(keys)) as Storages
  const proxyFormData = proxy.find((p) => p.id === current)

  if (proxyFormData) {
    proxySetSync({
      scope: 'regular',
      value: new Proxy(proxyFormData).toProxyConfig(),
    })
  } else {
    proxyClearSync({
      scope: 'regular',
    })
  }
})
