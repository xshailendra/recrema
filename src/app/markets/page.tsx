import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/footer/Footer';
import { MarketsSection } from '@/components/markets/MarketsSection';

export const metadata = {
    title: "Markets We Serve | Recrema",
    description: "Discover the industries Recrema empowers with sustainable, upcycled coffee-derived ingredients.",
};

export default function MarketsPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <MarketsSection />
            <Footer />
        </main>
    );
}
