import { Navbar } from "@/components/nav/Navbar";
import { AboutSection } from "@/components/about/AboutSection";
import { Footer } from "@/components/footer/Footer";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />
            <div className="pt-32">
                <AboutSection />
            </div>
            <Footer />
        </main>
    );
}
