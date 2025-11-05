"use client";
import { createContext, useContext, useState } from "react";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [storeId, setStoreId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

  return (
    <StoreContext.Provider value={{ storeId, setStoreId, categoryId, setCategoryId }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
