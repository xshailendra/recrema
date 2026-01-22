import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/footer/Footer';
import { TechnologySection } from '@/components/technology/TechnologySection';

export const metadata = {
    title: "Our Technology | Recrema",
    description: "Explore Recrema's patented supercritical CO2 extraction process and and sustainable processing workflow.",
};

export default function TechnologyPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <TechnologySection />
            <Footer />
        </main>
    );
}
