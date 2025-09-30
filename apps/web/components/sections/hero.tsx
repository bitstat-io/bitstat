import { TextAnimate } from "@workspace/ui/components/text-animate";
import { SearchBar } from "@workspace/ui/components/search-bar";
import { IconBrandDiscord, IconBrandX } from "@tabler/icons-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero" className="relative p-4 lg:p-6">
      {/* content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextAnimate
          once
          animation="blurIn"
          as="h1"
          className="font-mono max-w-6xl font-extrabold text-balance md:text-lg lg:text-2xl xl:text-3xl text-shadow-lg"
        >
          Understand Players Grow Your Game
        </TextAnimate>
        <div className="flex flex-1 items-center gap-4">
          <SearchBar />
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
        </div>
      </div>
    </section>
  );
}
