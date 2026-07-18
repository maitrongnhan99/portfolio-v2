import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import { rsvpSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

const isPayloadEnabled = (): boolean => process.env.PAYLOAD_ENABLED === "true";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = rsvpSchema.safeParse(body);

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
    await payload.create({ collection: "rsvps", data: parsed.data });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("@wedding_rsvp_error", error);
    return NextResponse.json(
      { error: "Không thể gửi xác nhận, vui lòng thử lại." },
      { status: 500 }
    );
  }
}
