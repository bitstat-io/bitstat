import Hero from "@/components/sections/hero";
import Games from "@/components/sections/games";
import Footer from "@/components/sections/footer";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query = "" } = await searchParams;

  return (
    <div className="container max-w-6xl mx-auto border-x">
      <Hero />
      <Suspense>
        <Games query={query} />
      </Suspense>
      <Footer />
    </div>
  );
}
