class I18n {
  private messages: {
    [messageName: string]: {
      message: string
    }
  } = {}

  async init() {
    if (import.meta.env.DEV) {
      const res = await fetch('/_locales/zh_CN/messages.json')
      this.messages = await res.json()
    }
  }

  getMessage(messageName: string) {
    if (chrome && chrome.i18n) return chrome.i18n.getMessage(messageName)
    if (this.messages[messageName]) return this.messages[messageName].message
    return 'unknown'
  }
}

export const i18n = new I18n()
