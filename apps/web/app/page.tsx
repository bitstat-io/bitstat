import Hero from "@/components/sections/hero";
import Games from "@/components/sections/games";
import Footer from "@/components/sections/footer";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="container mx-auto border-x">
      <Hero />
      <Suspense>
        <Games />
      </Suspense>
      <Footer />
    </div>
  );
}
