import {
  IconBrandDiscord,
  IconBrandX,
  IconDeviceGamepad2,
  IconUsersGroup,
} from "@tabler/icons-react";
import { TextAnimate } from "@workspace/ui/components/text-animate";
import { SearchBar } from "../search-bar";
import { Suspense } from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero" className="relative p-4 space-y-8">
      {/* content */}

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="space-y-4">
          <TextAnimate
            once
            animation="blurIn"
            as="h1"
            className="max-w-2xl font-mono font-bold text-left space-y-2 tracking-wide text-lg lg:text-2xl xl:text-4xl text-shadow-lg"
          >
            Next Level Gameplay With Unmatched Analytics
          </TextAnimate>
          {/* Subtext */}
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <Suspense>
            <SearchBar />
          </Suspense>

          {/* <div className="flex flex-1 items-center justify-end gap-4">
              <Link
                href="https://x.com/bitstatofficial"
                target="_blank"
                className="text-muted-foreground hover:text-accent-foreground duration-150 flex items-center gap-1"
              >
                <IconBrandX className="h-5 w-5" />
              </Link>
              <Link
                href="ttps://discord.gg/kmq82Xf9"
                target="_blank"
                className="text-muted-foreground hover:text-accent-foreground duration-150 flex items-center gap-1"
              >
                <IconBrandDiscord className="h-5 w-5" />
              </Link>
            </div> */}

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <IconUsersGroup className="h-5 w-5 md:h-8 md:w-8 text-primary" />
              <div>
                <p className="font-semibold text-[10px] md:text-sm lg:text-base">
                  300m+
                </p>
                <p className="text-[10px] md:text-sm text-muted-foreground">
                  Players Track
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IconDeviceGamepad2 className="h-5 w-5 md:h-8 md:w-8 text-primary" />
              <div>
                <p className="font-semibold text-[10px] md:text-sm lg:text-base">
                  10+
                </p>
                <p className="text-[10px] md:text-sm text-muted-foreground">
                  Partnered Games
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
