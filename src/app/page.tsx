import Hero from "@/components/Hero";
import QuickAccessSection from "@/components/QuickAccessSection";
import WebsitesSection from "@/components/Websitessection";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <Hero />
      <QuickAccessSection />
      <WebsitesSection />
      <Footer />
      {/* rest of your homepage content */}
    </div>
  );
} 