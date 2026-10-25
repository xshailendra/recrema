import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/footer/Footer';
import { ImpactSection } from '@/components/impact/ImpactSection';

export const metadata = {
    title: "Environmental & Social Impact | Recrema",
    description: "Learn about Recrema's contribution to the circular economy, regional partnerships, and alignment with national sustainability goals.",
};

export default function ImpactPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <ImpactSection />
            <Footer />
        </main>
    );
}
