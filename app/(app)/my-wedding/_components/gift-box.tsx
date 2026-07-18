"use client";

import { useState, type JSX } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { weddingData } from "../data";
import type { GiftAccount } from "../types";
import { SectionHeading } from "./section-heading";

function buildQrUrl(account: GiftAccount): string {
  const params = new URLSearchParams({ accountName: account.accountName });
  return `https://img.vietqr.io/image/${account.bankCode}-${account.accountNumber}-compact.png?${params.toString()}`;
}

function Envelope({ className }: { className?: string }): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-md bg-[var(--wed-green-deep)] shadow-xl ${className ?? ""}`}
    >
      <div className="absolute inset-2 border border-[var(--wed-gold)]/40" />
      <div className="absolute inset-x-0 top-0 h-2/5 bg-[var(--wed-green)] shadow-md [clip-path:polygon(0_0,100%_0,50%_100%)]" />
      <span className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 font-serif text-[var(--wed-gold)]">
        囍
      </span>
    </div>
  );
}

function GiftCard({
  title,
  account,
}: {
  title: string;
  account: GiftAccount;
}): JSX.Element {
  const { toast } = useToast();
  const qrUrl = account.qrImage ?? buildQrUrl(account);

  const handleDownload = async (): Promise<void> => {
    try {
      const response = await fetch(qrUrl);
      if (!response.ok) throw new Error(`QR fetch failed: ${response.status}`);

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `qr-${account.accountName.toLowerCase().replace(/\s+/g, "-")}.png`;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      toast({
        title: "Không thể lưu mã QR",
        description: "Vui lòng thử lại hoặc chụp màn hình.",
        variant: "destructive",
      });
    }
  };

  return (
    <figure className="flex flex-col items-center gap-1.5 text-center">
      <figcaption className="mb-2 font-[Inter] text-sm font-medium text-[var(--wed-green-deep)]">
        {title}
      </figcaption>
      <div className="w-full max-w-[220px] rounded-2xl bg-white p-5 shadow-sm">
        <Image
          src={qrUrl}
          alt={`Mã QR ${account.bank} của ${title}`}
          width={220}
          height={300}
          unoptimized
          className="h-auto w-full"
        />
      </div>
      <p className="mt-1 font-[Inter] text-sm text-[var(--wed-ink)]/70">
        {account.bank}
      </p>
      <p className="font-[Inter] text-sm text-[var(--wed-ink)]">
        {account.accountNumber}
      </p>
      <p className="font-[Inter] text-sm font-semibold text-[var(--wed-ink)]">
        {account.accountName}
      </p>
      <button
        type="button"
        onClick={handleDownload}
        className="mt-1 rounded-lg bg-[var(--wed-ink)]/10 px-4 py-2 font-[Inter] text-sm text-[var(--wed-ink)] transition-colors hover:bg-[var(--wed-ink)]/20"
      >
        ⬇ Lưu QR
      </button>
    </figure>
  );
}

export default function GiftBox(): JSX.Element {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const { couple, gift } = weddingData;

  return (
    <section
      aria-label="Hộp quà mừng"
      className="flex flex-col items-center gap-8 px-6 py-16 text-center sm:py-20"
    >
      <SectionHeading>HỘP QUÀ MỪNG</SectionHeading>

      <div className="mt-4 flex flex-col items-center gap-3">
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Mở hộp quà mừng để xem mã QR mừng cưới"
          animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
          transition={
            reducedMotion
              ? undefined
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
          whileHover={reducedMotion ? undefined : { y: -10, scale: 1.03 }}
          whileTap={reducedMotion ? undefined : { scale: 0.94, rotate: -2 }}
          className="relative flex items-start justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wed-gold)]"
        >
          <Envelope className="z-10 h-64 w-40 -rotate-6 text-4xl" />
          <Envelope className="-ml-6 mt-10 h-48 w-28 rotate-[10deg] text-3xl" />
        </motion.button>

        <p className="font-[Inter] text-sm text-[var(--wed-ink)]/50">
          Nhấn để mở
        </p>
      </div>

      <p className="wed-display max-w-lg text-xl text-[var(--wed-ink)] sm:text-2xl">
        {gift.note}
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="wed-root max-w-2xl overflow-hidden border-none bg-[#e6eee0] p-0 text-[var(--wed-ink)] sm:rounded-2xl [&>button]:text-[var(--wed-cream-text)]">
          <DialogHeader className="bg-[var(--wed-green-deep)] px-6 py-5">
            <DialogTitle className="wed-display text-center text-2xl tracking-[0.1em] text-[var(--wed-cream-text)]">
              HỘP QUÀ MỪNG
            </DialogTitle>
            <DialogDescription className="sr-only">
              Mã QR chuyển khoản mừng cưới của cô dâu và chú rể.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-8 px-6 pb-8 pt-4 sm:grid-cols-2 sm:gap-6 sm:px-10">
            <GiftCard
              title={`${couple.groom.role} - ${couple.groom.name}`}
              account={gift.groom}
            />
            <GiftCard
              title={`${couple.bride.role} - ${couple.bride.name}`}
              account={gift.bride}
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
