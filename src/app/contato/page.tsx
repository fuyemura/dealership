import { Navbar } from "@/components/features/landing/navbar";
import { Footer } from "@/components/features/landing/footer";
import { ContactSection } from "@/components/features/contact/contact-section";

export const metadata = {
  title: "Contato — Uyemura Tech",
  description: "Entre em contato com a Uyemura Tech para dúvidas ou suporte.",
};

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ContactSection />
      <Footer />
    </main>
  );
}