"use client";

import { useEffect, useState, type FormEvent, type JSX } from "react";
import { weddingData } from "../data";
import type { Wish } from "../types";
import { makeWish, prependWish } from "../lib/wishes";
import { SectionHeading } from "./section-heading";
import { useToast } from "@/hooks/use-toast";

const fieldClassName =
  "w-full rounded-lg border border-[var(--wed-ink)]/15 bg-white px-4 py-3 font-[Inter] text-sm text-[var(--wed-ink)] placeholder:text-[var(--wed-ink)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--wed-gold)]";

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (value: number): string => String(value).padStart(2, "0");

  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds(),
  )} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export default function WishesSection(): JSX.Element {
  const { toast } = useToast();
  const [wishes, setWishes] = useState<Wish[]>(weddingData.wishes);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isValid = name.trim().length > 0 && message.trim().length > 0;

  useEffect(() => {
    let cancelled = false;

    const loadWishes = async (): Promise<void> => {
      try {
        const response = await fetch("/api/wedding/wishes");
        if (!response.ok) return;

        const data = (await response.json()) as { wishes?: Wish[] };
        if (!cancelled && data.wishes && data.wishes.length > 0) {
          setWishes(data.wishes);
        }
      } catch {
        // Keep the seeded wishes if the guestbook can't be loaded.
      }
    };

    void loadWishes();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/wedding/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        toast({
          title: "Không thể gửi lời chúc",
          description: data?.error ?? "Vui lòng thử lại sau.",
          variant: "destructive",
        });
        return;
      }

      setWishes((current) =>
        prependWish(
          current,
          makeWish({ name, message, avatar: "" }, Date.now()),
        ),
      );
      setName("");
      setMessage("");
      toast({
        title: "Cảm ơn bạn!",
        description: "Lời chúc của bạn đã được gửi thành công.",
      });
    } catch {
      toast({
        title: "Không thể gửi lời chúc",
        description: "Vui lòng kiểm tra kết nối và thử lại.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      aria-label="Sổ lưu bút"
      className="flex flex-col items-center gap-8 px-6 py-16 sm:py-20"
    >
      <SectionHeading>SỔ LƯU BÚT</SectionHeading>

      <form
        className="flex w-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        onSubmit={handleSubmit}
      >
        <label htmlFor="wish-name" className="sr-only">
          Tên của bạn
        </label>
        <input
          id="wish-name"
          name="name"
          type="text"
          required
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nhập tên của bạn*"
          className={fieldClassName}
        />

        <label htmlFor="wish-message" className="sr-only">
          Lời chúc của bạn
        </label>
        <textarea
          id="wish-message"
          name="message"
          required
          rows={5}
          maxLength={500}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Nhập lời chúc của bạn*"
          className={fieldClassName}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="rounded-full bg-[var(--wed-green-deep)] px-8 py-3 font-[Inter] text-sm font-medium uppercase tracking-[0.15em] text-[var(--wed-cream-text)] transition-colors duration-300 hover:bg-[var(--wed-green)] disabled:cursor-not-allowed disabled:bg-[var(--wed-ink)]/20 disabled:text-[var(--wed-ink)]/50"
          >
            Gửi lời chúc
          </button>
        </div>
      </form>

      <ul className="flex w-full flex-col gap-4">
        {wishes.map((wish) => (
          <li
            key={wish.id}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-baseline justify-between gap-4">
              <p className="wed-display text-lg text-[var(--wed-ink)]">
                {wish.name}
              </p>
              <time
                dateTime={wish.createdAt}
                className="shrink-0 font-[Inter] text-xs text-[var(--wed-ink)]/50"
              >
                {formatTimestamp(wish.createdAt)}
              </time>
            </div>
            <p className="mt-2 font-[Inter] text-sm leading-relaxed text-[var(--wed-ink)]/80">
              {wish.message}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
