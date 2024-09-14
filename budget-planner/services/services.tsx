//give me store and get data for async storage

import AsyncStorage from '@react-native-async-storage/async-storage';
//get data from async storage
export async function getData(key: string) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return 'Bibek';
    }
  } catch (e) {
    console.error(e);
  }
}
//store data in async storage
export async function storeData(key: string, value: string) {
  try {
    await AsyncStorage.setItem
      (key, value);
  }
  catch (e) {
    console.error(e);
  }
}
//remove data from async storage
export async function removeData(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  }
  catch (e) {
    console.error(e);
  }
}
//clear async storage
export async function clearData() {
  try {
    await AsyncStorage.clear();
  }
  catch (e) {
    console.error(e);
  }
}