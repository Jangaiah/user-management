import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { StorageType } from '../../types/storage-type.enum';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
   private isBrowser: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // ✅ Safe getItem
  getItem(key: string): string | null {
    if (this.isBrowser) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error('localStorage getItem failed:', e);
      }
    }
    return null;
  }

  // ✅ Safe setItem
  setItem(key: string, value: string): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error('localStorage setItem failed:', e);
      }
    }
  }

  // ✅ Safe removeItem
  removeItem(key: string): void {
    if (this.isBrowser) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('localStorage removeItem failed:', e);
      }
    }
  }

  // ✅ Safe clear
  clear(): void {
    if (this.isBrowser) {
      try {
        localStorage.clear();
      } catch (e) {
        console.error('localStorage clear failed:', e);
      }
    }
  }

  // ✅ Safe JSON helper methods
  getObject<T>(key: string): T | null {
    const item = this.getItem(key);
    if (item) {
      try {
        return JSON.parse(item) as T;
      } catch {
        return null;
      }
    }
    return null;
  }

  setObject(key: string, value: any): void {
    this.setItem(key, JSON.stringify(value));
  }

}
