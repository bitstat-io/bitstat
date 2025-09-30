import Features from "@/components/sections/features";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import Pricing from "@/components/sections/pricing";

export default function Page() {
  return (
    <div className="container mx-auto">
      <Header />
      <main className="border border-b-0">
        <Hero />
        {/* <About /> */}
        <Features />
        {/* <Games /> */}
        <Pricing />
        {/* <FAQ /> */}
      </main>
      <Footer />
    </div>
  );
}
