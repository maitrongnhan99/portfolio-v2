import type { Metadata } from "next";
import WeddingExperience from "./_components/wedding-experience";
import { resolveWeddingSide } from "./lib/wedding-date";

const WEDDING_TITLE = "Thiệp Cưới | Trọng Nhân & Yến Linh";
const WEDDING_DESCRIPTION =
  "Trân trọng kính mời quý khách đến chung vui trong ngày trọng đại của Trọng Nhân & Yến Linh. Hôn lễ được cử hành vào tháng 07 năm 2026 tại Đồng Tháp. Mở thiệp để xem thông tin chi tiết và gửi lời chúc mừng đến cô dâu chú rể.";
const WEDDING_OG_DESCRIPTION =
  "Trân trọng kính mời quý khách đến chung vui trong ngày trọng đại của Trọng Nhân & Yến Linh — tháng 07 năm 2026.";

export const metadata: Metadata = {
  title: WEDDING_TITLE,
  description: WEDDING_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Thiệp Cưới Trọng Nhân & Yến Linh",
    title: WEDDING_TITLE,
    description: WEDDING_OG_DESCRIPTION,
    images: [
      {
        url: "/wedding/og-wedding.jpg",
        width: 1200,
        height: 630,
        alt: "Trọng Nhân & Yến Linh — Thiệp Cưới",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: WEDDING_TITLE,
    description: WEDDING_OG_DESCRIPTION,
    images: ["/wedding/og-wedding.jpg"],
  },
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
