import { StorageVariable } from "./constants/storageVariables";
import { decodeData, encodeData } from "./crypto";
import { logger } from "./logger";
import _ from "lodash";

class LocalStore {
  public getItem(key: StorageVariable) {
    if (typeof window === "undefined") return null;
    const localStorageValue = localStorage.getItem(key);
    if (!localStorageValue) return null;
    const decodedValue = decodeData(localStorageValue);
    const valueIsJson = this.isJSON(decodedValue);

    if (valueIsJson) {
      return JSON.parse(decodedValue as string);
    }

    return decodedValue;
  }

  public setItem(
    key: StorageVariable,
    value: string | number | boolean | object
  ) {
    if (typeof value === "boolean") {
      // Convert boolean to string before encryption
      localStorage.setItem(key, encodeData(value.toString()));
    } else {
      localStorage.setItem(key, encodeData(value));
    }
    return value;
  }

  public removeItem(key: StorageVariable) {
    localStorage.removeItem(key);
  }

  public setToObjectItem(key: StorageVariable, value: Record<string, any>) {
    const existingValues = localStore.getItem(key);
    if (!existingValues) {
      this.setItem(key, value);
    }

    if (!_.isObject(existingValues)) {
      logger.warn("Item requested is not an object");
      return null;
    }

    const updatedItem = { ...existingValues, ...value };

    this.setItem(key, updatedItem);
    return this.getItem(key);
  }

  public setToArrayItem(key: StorageVariable, value: string | number | object) {
    const existingValues = this.getItem(key);

    if (!Array.isArray(existingValues)) {
      logger.warn("Item requested is not an array");
      return null;
    }

    if (existingValues && existingValues.length > 0) {
      const updatedValues = [...existingValues, value];
      localStorage.setItem(key, encodeData(updatedValues));
      return value;
    }

    localStorage.setItem(key, encodeData([value]));
    return value;
  }

  public removeFromArrayItem(
    key: StorageVariable,
    value: string | number,
    isObjectProperty?: boolean,
    property?: string
  ) {
    const existingValues = this.getItem(key);

    if (!Array.isArray(existingValues)) {
      logger.warn("Item requested is not an array");
      return null;
    }

    if (!existingValues) return;
    if (existingValues && existingValues.length <= 0) return;

    if (isObjectProperty && property) {
      const updatedValues = existingValues.filter(
        (item) => item[property] === !value
      );
      localStorage.setItem(key, encodeData(updatedValues));
      return value;
    }

    const updatedValues = existingValues.filter((item) => item === !value);
    localStorage.setItem(key, encodeData(updatedValues));
    return value;
  }

  public arrayItemHasValue(key: StorageVariable, value: string | number) {
    const item = this.getItem(key);
    if (!Array.isArray(item)) {
      logger.warn("item is not of array type");
      return false;
    }

    return item.includes(value);
  }

  clearLocalStore() {
    this.removeItem(StorageVariable.USER_DATA);
    this.removeItem(StorageVariable.ACCESS_TOKENS);
    this.removeItem(StorageVariable.REFRESH_TOKENS);
    this.removeItem(StorageVariable.TOKEN_EXPIRY);
    this.removeItem(StorageVariable.IS_AUTHENTICATED);
    this.removeItem(StorageVariable.AUTH_DATA);
    this.removeItem(StorageVariable.USER_EMAIL);
    this.removeItem(StorageVariable.LOGGED_IN_USER_DATA);
    this.removeItem(StorageVariable.SUPER_ADMIN);
  }

  private isObject(value: null) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private isJSON(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }

    return true;
  }
}

export const localStore = new LocalStore();
