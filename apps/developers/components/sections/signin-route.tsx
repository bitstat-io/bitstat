import { IconLogin } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export default function SigninRoute() {
  return (
    <Button variant="ghost" size="sm" asChild>
      <Link
        href="/sign-in"
        className="text-base text-muted-foreground hover:text-accent-foreground duration-150 flex items-center gap-1"
      >
        Login
      </Link>
    </Button>
  );
}
