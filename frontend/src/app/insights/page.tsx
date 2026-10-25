import type { Metadata } from "next";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/footer/Footer";
import { InsightsExperience } from "@/components/impact/InsightsExperience";

export const metadata: Metadata = {
  title: "Public Impact Insights | Recrema",
  description: "Explore Recrema's verified coffee-waste recovery and circular impact insights.",
};

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-[#FDF8F3]">
      <Navbar />
      <InsightsExperience />
      <Footer />
    </main>
  );
}
