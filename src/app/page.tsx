import Hero from "@/components/Hero";
import QuickAccessSection from "@/components/QuickAccessSection";
import WebsitesSection from "@/components/Websitessection";
import DirectorySection from "@/components/DirectorySection";
import PersonaGuidanceSection from "@/components/PersonaGuidanceSection";
import PstContactSection from "@/components/PstContactSection";
import Footer from "@/components/footer";
import { fetchKategori, fetchLayanan, fetchWebsite } from "@/lib/api";
import type { CardData } from "@/data";
import type { FlatResult } from "@/components/SearchBar";
import type { LayananItem } from "@/lib/api";

// ─────────────────────────────────────────────
// BUILD CARDS (kategori + layanan → CardData[])
// ─────────────────────────────────────────────

async function buildCards(): Promise<CardData[]> {
  const [kategoris, layanans] = await Promise.all([
    fetchKategori(),
    fetchLayanan(),
  ]);

  if (kategoris.length === 0) return [];

  const map = new Map<number, CardData>();

  for (const k of kategoris) {
    map.set(k.id_kategori, {
      title: k.nama_kategori,
      category: k.nama_kategori,
      description: k.deskripsi,
      links: [],
    });
  }

  // API returns DESC order — reverse so links are ASC inside each card
  const ordered = [...layanans].reverse();

  for (const l of ordered) {
    const card = map.get(l.id_kategori);
    if (!card) continue;
    card.links.push({ label: l.nama_layanan, href: l.url || "#", logo: l.logo || undefined });
  }

  return Array.from(map.values());
}

// ─────────────────────────────────────────────
// BUILD SEARCH INDEX (website → FlatResult[])
// ─────────────────────────────────────────────

async function buildSearchIndex(): Promise<FlatResult[]> {
  const categories = await fetchWebsite();
  const flat: FlatResult[] = [];

  for (const cat of categories) {
    for (const link of cat.links) {
      flat.push({
        id: link.id_layanan,
        label: link.label,
        href: link.href || "",
        category: cat.category,
      });
    }
  }

  return flat;
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default async function Home() {
  let cards: CardData[] = [];
  let searchIndex: FlatResult[] = [];
  let layanans: LayananItem[] = [];

  try {
    [cards, searchIndex, layanans] = await Promise.all([
      buildCards(),
      buildSearchIndex(),
      fetchLayanan(),
    ]);
  } catch (err) {
    console.error("[Page] Failed to load data:", err instanceof Error ? err.message : err);
    // cards, searchIndex, layanans remain [] — components handle empty state
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <Hero searchIndex={searchIndex} />
      <QuickAccessSection />
      <WebsitesSection cards={cards} />
      <DirectorySection layanans={layanans} />
      <PersonaGuidanceSection />
      <PstContactSection />
      <Footer />
    </div>
  );
}