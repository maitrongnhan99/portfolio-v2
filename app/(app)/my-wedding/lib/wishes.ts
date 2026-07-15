import type { Wish } from "@/app/(app)/my-wedding/types";

export function makeWish(input: { name: string; message: string; avatar: string }, nowMs: number): Wish {
  return {
    id: String(nowMs),
    name: input.name.trim(),
    message: input.message.trim(),
    avatar: input.avatar,
    createdAt: new Date(nowMs).toISOString(),
  };
}

export function prependWish(list: Wish[], wish: Wish): Wish[] {
  return [wish, ...list];
}
