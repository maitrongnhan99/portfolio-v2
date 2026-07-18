import type { Metadata } from "next";
import WeddingExperience from "./_components/wedding-experience";
import { resolveWeddingSide } from "./lib/wedding-date";

export const metadata: Metadata = {
  title: "Trọng Nhân & Yến Linh — Thiệp Cưới",
};

export default async function WeddingPage({
  searchParams,
}: {
  searchParams: Promise<{ at?: string | string[] }>;
}) {
  const { at } = await searchParams;
  const side = resolveWeddingSide(at);

  return (
    <main data-testid="wedding-page">
      <WeddingExperience side={side} />
    </main>
  );
}
