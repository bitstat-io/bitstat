import { TextAnimate } from "@workspace/ui/components/text-animate";
// import PrismaticBurst from "../ui/prismatic-burst";

export default function Hero() {
  return (
    <section id="hero" className="relative p-4 lg:p-6">
      {/* <PrismaticBurst
        animationType="rotate3d"
        intensity={2}
        speed={0.5}
        distort={1.0}
        paused={false}
        offset={{ x: 0, y: 0 }}
        hoverDampness={0.25}
        rayCount={24}
        mixBlendMode="lighten"
        colors={["#ff007a", "#4d3dff", "#ffffff"]}
      /> */}

      {/* content */}
      <div className="flex flex-col items-center justify-end space-y-2 lg:space-y-4">
        <TextAnimate
          once
          animation="blurIn"
          as="h1"
          className="mx-auto font-mono max-w-6xl font-extrabold text-balance text-4xl sm:text-5xl mg:text-6xl lg:text-7xl xl:text-[5.25rem] text-shadow-lg"
        >
          Understand Players
        </TextAnimate>
        <TextAnimate
          once
          animation="blurIn"
          as="h1"
          className="mx-auto font-mono max-w-6xl font-extrabold text-balance text-4xl sm:text-5xl mg:text-6xl lg:text-7xl xl:text-[5.25rem] text-shadow-lg"
        >
          Grow Your Game
        </TextAnimate>
        {/* <TextAnimate
          once
          animation="blurIn"
          as="p"
          className="text-shadow-md text-accent-foreground/80 mx-auto max-w-2xl text-center text-balance text-lg"
        >
          Comprehensive analytics and insights for Web3 game developers. Track
          user behavior, optimize retention, and maximize revenue with real-time
          data across your entire gaming ecosystem.
        </TextAnimate> */}
      </div>
    </section>
  );
}
