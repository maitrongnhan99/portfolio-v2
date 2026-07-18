import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import { wishSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

const isPayloadEnabled = (): boolean => process.env.PAYLOAD_ENABLED === "true";

interface PublicWish {
  id: string;
  name: string;
  message: string;
  avatar: string;
  createdAt: string;
}

export async function GET() {
  if (!isPayloadEnabled()) {
    return NextResponse.json({ wishes: [] });
  }

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "wishes",
      where: { approved: { equals: true } },
      sort: "-createdAt",
      limit: 100,
    });

    const wishes: PublicWish[] = result.docs.map((doc) => ({
      id: String(doc.id),
      name: doc.name,
      message: doc.message,
      avatar: doc.avatar ?? "",
      createdAt: doc.createdAt,
    }));

    return NextResponse.json({ wishes });
  } catch (error) {
    // Never break the page if the guestbook can't be read.
    console.error("@wedding_wishes_get_error", error);
    return NextResponse.json({ wishes: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = wishSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    if (!isPayloadEnabled()) {
      return NextResponse.json(
        { error: "Tính năng tạm thời không khả dụng" },
        { status: 503 }
      );
    }

    const payload = await getPayload({ config });
    // Always force approved:false — new public wishes are hidden until moderated.
    await payload.create({
      collection: "wishes",
      data: { ...parsed.data, approved: false },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("@wedding_wishes_post_error", error);
    return NextResponse.json(
      { error: "Không thể gửi lời chúc, vui lòng thử lại." },
      { status: 500 }
    );
  }
}
