import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/footer/Footer';
import { ExtractsSection } from '@/components/extracts/ExtractsSection';

export const metadata = {
    title: "Our Extracts | Recrema",
    description: "Explore Recrema's premium coffee extracts, ranging from cosmetic-grade oil to pharmaceutical caffeine and organic fertilizers.",
};

export default function ExtractsPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <ExtractsSection />
            <Footer />
        </main>
    );
}
