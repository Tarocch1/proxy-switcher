import { Storages } from '@/utils/storage'
import { Proxy, proxySetSync, proxyClearSync } from '@/utils/proxy'

const keys = ['proxy', 'current']

function setBadge(color: string) {
  chrome.action.setBadgeBackgroundColor({
    color: color,
  })
  chrome.action.setBadgeText({
    text: ' ',
  })
}

function clearBadge() {
  chrome.action.setBadgeText({
    text: '',
  })
}

async function setProxy() {
  const { current, proxy } = (await chrome.storage.sync.get(keys)) as Storages
  const proxyFormData = proxy.find((p) => p.id === current)

  if (proxyFormData) {
    proxySetSync({
      scope: 'regular',
      value: new Proxy(proxyFormData).toProxyConfig(),
    })
    setBadge(proxyFormData.color)
  } else {
    proxyClearSync({
      scope: 'regular',
    })
    clearBadge()
  }
}

chrome.storage.onChanged.addListener(setProxy)

chrome.runtime.onStartup.addListener(setProxy)
