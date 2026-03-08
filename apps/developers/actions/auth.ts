"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const signin = async (
  formData: FormData
): Promise<{ error: boolean; message: string }> => {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (!error) {
    revalidatePath("/", "layout");
    return { error: false, message: "" };
  }
  return { error: true, message: error.message };
};

export const signup = async (
  formData: FormData
): Promise<{ error: boolean; message: string }> => {
  const supabase = await createClient();
  try {
    const form = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const { error: signup_error, data: user_data } = await supabase.auth.signUp(
      form
    );

    if (signup_error && !user_data?.user) {
      return { error: true, message: signup_error.message };
    }

    revalidatePath("/", "layout");
    return { error: false, message: "" };
  } catch (error) {
    return {
      error: true,
      message: "Something went wrong signing up. " + error,
    };
  }
};

export const signout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/sign-in");
};
