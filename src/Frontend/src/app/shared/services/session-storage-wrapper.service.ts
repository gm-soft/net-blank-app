import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageWrapper {
  getItem<T>(key: string): T {
    return JSON.parse(sessionStorage.getItem(key));
  }

  setItem<T>(key: string, value: T): boolean {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  }

  removeItem(key: string): boolean {
    sessionStorage.removeItem(key);
    return true;
  }

  clear(): void {
    sessionStorage.clear();
  }
}
