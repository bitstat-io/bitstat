"use client";

import { createUserStore } from "./store";
import { type ReactNode, createContext, useRef } from "react";

// Type for the user Store API
export type UserStoreApi = ReturnType<typeof createUserStore>;

// Create a context for the user Store
export const UserStoreContext = createContext<UserStoreApi | undefined>(
  undefined
);

export interface UserStoreProviderProps {
  children: ReactNode;
}

// user Store Provider Component
export const UserStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<UserStoreApi | null>(null);

  // Initialize the store only once
  if (storeRef.current === null) {
    storeRef.current = createUserStore();
  }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  );
};
