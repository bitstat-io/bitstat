import { IconLogo } from "@workspace/ui/components/logo";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto p-6">
      <Link
        href="/"
        aria-label="home"
        className="flex items-center space-x-2 text-lg font-mono font-bold text-shadow-lg"
      >
        <div className="flex items-center font-mono gap-2 text-xl font-bold">
          <IconLogo width="30px" /> Bitstat
        </div>
      </Link>

      <div className="flex items-center justify-center mt-30">{children}</div>
    </div>
  );
}
