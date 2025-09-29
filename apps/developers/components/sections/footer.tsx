import { IconLogo } from "@workspace/ui/components/logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="container mx-auto p-2 md:p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center font-mono gap-2 text-xl font-bold">
              <IconLogo className="text-primary" width={30} /> bitstat
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              The comprehensive analytics platform for Web3 gaming ecosystems.
              Track performance, optimize earnings, and dominate leaderboards
              across multiple games.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="#features"
                  className="hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/games"
                  className="hover:text-foreground transition-colors"
                >
                  Games
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Misc</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="https://bitstat-whitepaper.gitbook.io/bitstat-whitepaper-docs/"
                  target="_blank"
                  className="hover:text-foreground transition-colors"
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/bitstatofficial"
                  target="_blank"
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  X-app
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  Discord
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-8 py-4 flex justify-center items-center">
        <p className="text-muted-foreground text-sm text-center">
          © 2024 Bitstat. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
