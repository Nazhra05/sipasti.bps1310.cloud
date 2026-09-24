import Link from "next/link";
import Image from "next/image";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { quickAccessItems } from "@/data";

/**
 * QuickAccessSection
 * - bg-[#043277] to match the Navbar's dark BPS blue
 * - Logos scroll infinitely sideways via <InfiniteSlider />
 *   (pauses/slows down on hover via durationOnHover)
 * - Each logo sits on a white rounded card so it stays visible
 *   regardless of whether the source PNG has a transparent background
 * - Logo + href data comes from `quickAccessItems` in data.ts — edit
 *   that file to add/remove/change logos or links
 *
 * Requires: framer-motion, react-use-measure (for InfiniteSlider)
 * -> npm install framer-motion react-use-measure
 */
export default function QuickAccessSection() {
  return (
    <section className="w-full bg-[#043277]">
      <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6 lg:px-8">
        <InfiniteSlider gap={48} duration={25} durationOnHover={75} className="w-full">
          {quickAccessItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex h-24 w-40 shrink-0 items-center justify-center transition-transform hover:scale-105"
            >
              <div className="relative h-full w-full">
                <Image
                  src={item.logo}
                  alt={item.label}
                  fill
                  sizes="160px"
                  className="object-contain"
                />
              </div>
            </Link>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}