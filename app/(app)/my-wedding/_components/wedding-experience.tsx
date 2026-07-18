"use client";

import CoverGate from "./cover-gate";
import Hero from "./hero";
import CeremonyInfo from "./ceremony-info";
import Gallery from "./gallery";
import ReceptionInfo from "./reception-info";
import WishesSection from "./wishes-section";
import GiftBox from "./gift-box";
import { resolveWeddingDate, type WeddingSide } from "../lib/wedding-date";
import { resolveCoupleOrder } from "../lib/wedding-order";

export default function WeddingExperience({ side }: { side: WeddingSide }) {
  const weddingDate = resolveWeddingDate(side);
  const coupleOrder = resolveCoupleOrder(side);

  return (
    <CoverGate coverDate={weddingDate.coverDate} order={coupleOrder}>
      <div className="mx-auto w-full max-w-2xl bg-[var(--wed-cream)]">
        <Hero order={coupleOrder} />
        <CeremonyInfo eventDate={weddingDate} order={coupleOrder} />
        <Gallery />
        <ReceptionInfo eventDate={weddingDate} />
        <WishesSection />
        <GiftBox />
      </div>
    </CoverGate>
  );
}
