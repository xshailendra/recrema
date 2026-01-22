import { Navbar } from "@/components/nav/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { MenuTabs } from "@/components/menu/MenuTabs";
import { ShopsGrid } from "@/components/shops/ShopsGrid";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <MenuTabs />
      <ShopsGrid />
      <FaqAccordion />
      <Footer />
    </main>
  );
}

