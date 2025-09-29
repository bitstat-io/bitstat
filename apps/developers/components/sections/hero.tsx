import Link from "next/link";
import { IconRocket } from "@tabler/icons-react";
import { TextAnimate } from "@workspace/ui/components/text-animate";
import { Button } from "@workspace/ui/components/button";
import { ShimmerButton } from "@workspace/ui/components/shimmer-button";
// import Prism from "@workspace/ui/components/prism";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[1610px] m-4">
      {/* bg overlay */}
      <div className="absolute top-0 w-full h-30 bg-gradient-to-b from-background to-transparent z-10" />
      <div className="absolute left-0 w-40 h-full bg-gradient-to-r from-background  to-transparent z-10" />
      <div className="absolute right-0 w-40 h-full bg-gradient-to-l from-background  to-transparent z-10" />

      {/* bg */}
      <div className="h-[900px]">
        {/* <Prism
          animationType="hover"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={2.5}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        /> */}
      </div>

      {/* content */}
      <div className="absolute flex flex-col items-center justify-end space-y-4 lg:space-y-8 inset-0 z-20 mt-32">
        {/* Badge */}
        {/* <Link
          href="#link"
          className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-sm shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
        >
          <span className="text-foreground text-sm">
            Introducing Support for AI Models
          </span>
          <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

          <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
              <span className="flex size-6">
                <IconArrowRight className="m-auto size-3" />
              </span>
              <span className="flex size-6">
                <IconArrowRight className="m-auto size-3" />
              </span>
            </div>
          </div>
        </Link> */}
        <TextAnimate
          once
          animation="blurIn"
          as="h1"
          className="mx-auto font-mono max-w-6xl text-center font-extrabold text-balance text-4xl sm:text-5xl mg:text-6xl lg:text-7xl xl:text-[5.25rem] text-shadow-lg"
        >
          Build Smarter Web3 Games with Data
        </TextAnimate>
        <TextAnimate
          once
          animation="blurIn"
          as="p"
          className="text-shadow-md text-accent-foreground/80 mx-auto max-w-2xl text-center text-balance text-lg"
        >
          Comprehensive analytics and insights for Web3 game developers. Track
          user behavior, optimize retention, and maximize revenue with real-time
          data across your entire gaming ecosystem.
        </TextAnimate>
        <div className="flex items-center gap-4 lg:gap-8">
          <Link href="https://bitstat.io" aria-label="Start Free Trial">
            <ShimmerButton
              aria-label="Start Free Trial"
              shimmerSize="0.1em"
              background={"var(--primary)"}
              className="shadow-2xl"
            >
              <span className="text-primary-foreground font-semibold flex items-center gap-2">
                Launch App
                <IconRocket className="rotate-315" size={20} />
              </span>
            </ShimmerButton>
          </Link>
          {/* <Button
            asChild
            variant="outline"
            className="rounded-full p-6 text-lg"
          >
            <Link
              href="https://bitstat-whitepaper.gitbook.io/bitstat-whitepaper-docs/"
              target="_blank"
            >
              Learn More
            </Link>
          </Button> */}
        </div>
        <div className="shadow-lg border rounded-md w-full p-4 bg-background h-full">
          <iframe src="/dashboard" className="size-full" />
        </div>
      </div>
    </section>
  );
}
