import { createClient } from "@/lib/supabase/server";

export const API_URL = process.env.API_URL?.replace(/\/+$/, "");

export async function getAuthHeaders() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}
