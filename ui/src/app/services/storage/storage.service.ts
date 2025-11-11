import { Injectable } from '@angular/core';
import { StorageType } from '../../types/storage-type.enum';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage = localStorage;
  constructor() { }
  getStorageType(): Storage {
    return this.storage;
  }
  setStorageType(type: StorageType): void {
    switch(type) {
      default:
      case StorageType.LocalStorage:
        this.storage = localStorage;
        break;
      case StorageType.SessionStorage:
        this.storage = sessionStorage;
        break;
      case StorageType.InMemory:
        this.storage = new Map<string, string>() as unknown as Storage;
        break;
    }
  }

}
