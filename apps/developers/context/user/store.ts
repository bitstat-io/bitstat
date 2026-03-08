import { createClient } from "@/lib/supabase/client";
import { createStore } from "zustand/vanilla";
import { UserStateT, UserStoreT } from "@workspace/ui/lib/types";

export const defaultInitState: UserStateT = {
  id: "",
  email: "",
};

export const createUserStore = (initState: UserStateT = defaultInitState) => {
  return createStore<UserStoreT>()((set) => ({
    ...initState,
    fetchUserData: async () => {
      try {
        const supabase = createClient();
        const { error: auth_error, data: user_data } =
          await supabase.auth.getUser();

        if (auth_error || !user_data) {
          console.log("Error: ", auth_error);
          return;
        }

        const userId = user_data.user.id;

        const { error, data } = await supabase
          .from("core_tenants")
          .select("id, email")
          .eq("id", userId)
          .single();

        if (error) {
          console.log("Error: ", error);
          return;
        }

        set({
          id: data.id,
          email: data.email,
        });

        console.log("Tests: ", {
          id: data.id,
          email: data.email,
        });
      } catch (error) {
        console.log("Error: ", error);
      }
    },
  }));
};
