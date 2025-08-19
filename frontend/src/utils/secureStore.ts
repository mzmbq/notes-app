import * as SecureStore from "expo-secure-store";
import { log } from "../logger/logger";
import { Platform } from "react-native";

const save = async (key: string, value: string) => {
  log.debug(`[secureStore] Setting the key: ${key} to value: ${value}`);
  if (Platform.OS === "web") {
    await cookieStore.set(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

const get = async (key: string): Promise<string> => {
  log.debug(`[secureStore] Gettings the value for key: ${key}`);
  if (Platform.OS === "web") {
    const result = await cookieStore.get(key);
    if (!result || !result.value) {
      const errMsg = `[secureStore] Couldn't not get the cookie value for: ${key}`;
      throw new Error(errMsg);
    }
    return result.value;
  }

  const result = await SecureStore.getItemAsync(key);
  if (!result) {
    const errMsg = `[secureStore] Couldn't not get the secure value for: ${key}`;
    log.error(errMsg);
    throw new Error(errMsg);
  }
  return result;
};

const clear = async (key: string) => {
  log.debug(`[secureStore] Deleting the value for key: ${key}`);
  if (Platform.OS === "web") {
    await cookieStore.delete(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
};

export default { save, get, clear };
