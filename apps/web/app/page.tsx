import Hero from "@/components/sections/hero";
import Games from "@/components/sections/games";
import Footer from "@/components/sections/footer";

export default function Page() {
  return (
    <div className="container mx-auto border">
      <Hero />
      <Games />
      <Footer />
    </div>
  );
}
