const localStoreageKey = "localStoreageKey";

export const setLocalStoreage = (data) => {
  localStorage.setItem(localStoreageKey, data);
};

export const getLocalStoreag = () => {
  return localStorage.getItem(localStoreageKey);
};

export const removeLocalStoreag = () => {
  localStorage.removeItem(localStoreageKey);
};
