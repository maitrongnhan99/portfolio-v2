// Two celebration days: the groom's family hosts on 28/07/2026 and the bride's
// family on 27/07/2026. The active day is chosen by the `?at=groom|bride` query
// param (defaulting to the groom's day) and drives the cover, ceremony, and
// reception date/countdown/calendar across the invitation.

export type WeddingSide = "groom" | "bride";

export interface WeddingDateBlock {
  weekday: string;
  day: string;
  month: string;
  year: string;
  lunar: string;
}

export interface ResolvedWeddingDate {
  side: WeddingSide;
  coverDate: string;
  datetime: string;
  timeLabel: string;
  dateBlock: WeddingDateBlock;
}

const VARIANTS: Record<WeddingSide, ResolvedWeddingDate> = {
  groom: {
    side: "groom",
    coverDate: "28 tháng 7, 2026",
    datetime: "2026-07-28T09:00:00+07:00",
    timeLabel: "09:00, Thứ Ba",
    dateBlock: {
      weekday: "Thứ Ba",
      day: "28",
      month: "07",
      year: "2026",
      lunar: "Nhằm ngày 15 tháng 6 năm Bính Ngọ",
    },
  },
  bride: {
    side: "bride",
    coverDate: "27 tháng 7, 2026",
    datetime: "2026-07-27T09:00:00+07:00",
    timeLabel: "09:00, Thứ Hai",
    dateBlock: {
      weekday: "Thứ Hai",
      day: "27",
      month: "07",
      year: "2026",
      lunar: "Nhằm ngày 14 tháng 6 năm Bính Ngọ",
    },
  },
};

export function resolveWeddingSide(at?: string | string[] | null): WeddingSide {
  const value = Array.isArray(at) ? at[0] : at;
  return value === "bride" ? "bride" : "groom";
}

export function resolveWeddingDate(at?: string | string[] | null): ResolvedWeddingDate {
  return VARIANTS[resolveWeddingSide(at)];
}
