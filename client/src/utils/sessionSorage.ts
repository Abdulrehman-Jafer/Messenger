export function setSessionStorage<T>(key: string, value: T) {
  return window.sessionStorage.setItem(key, JSON.stringify(value));
}

export function getSessionStorage(key: string) {
  return JSON.parse(window.sessionStorage.getItem(key)!);
}
