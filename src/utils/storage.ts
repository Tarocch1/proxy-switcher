export function storageGetSync(keys: string[]) {
  return new Promise<{ [key: string]: any }>(resolve => {
    chrome.storage.sync.get(keys, resolve);
  });
}

export function storageSetSync(data: { [key: string]: any }) {
  return new Promise<void>(resolve => {
    chrome.storage.sync.set(data, resolve);
  });
}
