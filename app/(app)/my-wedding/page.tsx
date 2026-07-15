import type { Metadata } from "next";
import { weddingData } from "./data";

export const metadata: Metadata = {
  title: "Hải Nam & Khánh Linh — Thiệp Cưới",
};

export default function WeddingPage() {
  return (
    <main data-testid="wedding-page">
      {/* Temporary placeholder — later tasks replace this body with the
          full section composition (CoverGate, hero, timeline, etc.). */}
      <h1 className="wed-display">{weddingData.couple.combined}</h1>
    </main>
  );
}
