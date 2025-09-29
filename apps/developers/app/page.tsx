import Features from "@/components/sections/features";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import Pricing from "@/components/sections/pricing";

export default function Page() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 space-y-20 mb-24">
        <Hero />
        {/* <About /> */}
        <Features />
        {/* <Games /> */}
        <Pricing />
        {/* <FAQ /> */}
      </main>
      <Footer />
    </>
  );
}
