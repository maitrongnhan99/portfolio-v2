"use client";

import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface RsvpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Attendance = "Có" | "Không";

const inputClassName =
  "w-full rounded-sm border border-[var(--wed-gold)]/40 bg-[var(--wed-cream)] px-3 py-2 font-[Inter] text-sm text-[var(--wed-ink)] placeholder:text-[var(--wed-ink)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--wed-gold)]";

export default function RsvpModal({ open, onOpenChange }: RsvpModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("Có");
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState("");

  const isValid = name.trim().length > 0;

  const resetForm = () => {
    setName("");
    setAttendance("Có");
    setGuestCount(1);
    setMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;

    toast({
      title: "Cảm ơn bạn!",
      description: `Chúng tôi đã nhận được xác nhận tham dự của ${name.trim()}.`,
    });

    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="wed-root max-w-md border-[var(--wed-gold)]/30 bg-[var(--wed-cream)] text-[var(--wed-ink)] sm:rounded-lg">
        <DialogHeader>
          <DialogTitle className="wed-display text-2xl text-[var(--wed-green-deep)]">
            Xác nhận tham dự
          </DialogTitle>
          <DialogDescription className="font-[Inter] text-sm text-[var(--wed-ink)]/70">
            Vui lòng cho chúng tôi biết bạn có thể tham dự hay không.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="rsvp-name"
              className="font-[Inter] text-xs uppercase tracking-[0.15em] text-[var(--wed-ink)]/80"
            >
              Tên của bạn
            </label>
            <input
              id="rsvp-name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nguyễn Văn A"
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="rsvp-attendance"
              className="font-[Inter] text-xs uppercase tracking-[0.15em] text-[var(--wed-ink)]/80"
            >
              Bạn có thể tham dự không?
            </label>
            <select
              id="rsvp-attendance"
              name="attendance"
              value={attendance}
              onChange={(event) => setAttendance(event.target.value as Attendance)}
              className={inputClassName}
            >
              <option value="Có">Có, tôi sẽ tham dự</option>
              <option value="Không">Không thể tham dự</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="rsvp-guest-count"
              className="font-[Inter] text-xs uppercase tracking-[0.15em] text-[var(--wed-ink)]/80"
            >
              Số lượng khách
            </label>
            <input
              id="rsvp-guest-count"
              name="guestCount"
              type="number"
              min={1}
              value={guestCount}
              onChange={(event) => setGuestCount(Number(event.target.value))}
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="rsvp-message"
              className="font-[Inter] text-xs uppercase tracking-[0.15em] text-[var(--wed-ink)]/80"
            >
              Lời nhắn
            </label>
            <textarea
              id="rsvp-message"
              name="message"
              rows={3}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Gửi lời chúc mừng tới cô dâu chú rể..."
              className={inputClassName}
            />
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="mt-2 rounded-full border border-[var(--wed-gold)] bg-[var(--wed-green-deep)] px-6 py-2.5 font-[Inter] text-sm uppercase tracking-[0.2em] text-[var(--wed-cream)] transition-colors duration-300 hover:bg-[var(--wed-gold)] hover:text-[var(--wed-green-deep)] disabled:cursor-not-allowed disabled:border-[var(--wed-ink)]/20 disabled:bg-[var(--wed-ink)]/20 disabled:text-[var(--wed-ink)]/50 disabled:hover:bg-[var(--wed-ink)]/20 disabled:hover:text-[var(--wed-ink)]/50"
          >
            Gửi xác nhận
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
