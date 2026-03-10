"use client";

import { Button } from "@workspace/ui/components/button";
import { createClient } from "@/lib/supabase/client";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function GoogleSigninButton() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignin = async () => {
    setLoading(true);

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to start Google sign-in.",
      );
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={loading}
      onClick={handleGoogleSignin}
    >
      {loading ? <Loader className="animate-spin" /> : "Continue with Google"}
    </Button>
  );
}
