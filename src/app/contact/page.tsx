import { Navbar } from "@/components/nav/Navbar";
import { ContactForm } from "@/components/contact/ContactForm";
import { Footer } from "@/components/footer/Footer";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />
            <ContactForm />
            <Footer />
        </main>
    );
}
