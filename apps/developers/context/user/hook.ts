import { UserStoreT } from "@workspace/ui/lib/types";
import { useContext } from "react";
import { useStore } from "zustand";
import { UserStoreContext } from "./provider";

// Custom hook to access the User Store
export const useUserStore = <T>(selector: (store: UserStoreT) => T): T => {
  const userStoreContext = useContext(UserStoreContext);

  // Throw an error if used outside the provider
  if (!userStoreContext) {
    throw new Error("useUserStore must be used within UserStoreProvider");
  }

  // Use Zustand's useStore hook to select data from the store
  return useStore(userStoreContext, selector);
};
