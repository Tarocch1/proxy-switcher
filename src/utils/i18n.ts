let messages: {
  [messageName: string]: {
    message: string
  }
} = {}

export async function initI18n() {
  if (import.meta.env.DEV) {
    const res = await fetch('/_locales/zh_CN/messages.json')
    messages = await res.json()
  }
}

export function getMessage(messageName: string): string {
  if (chrome && chrome.i18n) return chrome.i18n.getMessage(messageName)
  if (messages[messageName]) return messages[messageName].message
  return 'unknown'
}
