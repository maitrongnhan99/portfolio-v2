import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import WishesSection from "@/app/(app)/my-wedding/_components/wishes-section";
import { weddingData } from "@/app/(app)/my-wedding/data";

function mockFetch(handlers: {
  get?: () => Promise<Response> | Response;
  post?: () => Promise<Response> | Response;
}) {
  return vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
    if (init?.method === "POST") {
      return handlers.post?.() ?? new Response(null, { status: 500 });
    }
    return handlers.get?.() ?? Response.json({ wishes: [] });
  });
}

describe("WishesSection", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch({}));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the heading, form fields, and seeded wishes when the API is empty", async () => {
    render(<WishesSection />);

    expect(screen.getByText("SỔ LƯU BÚT")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Nhập tên của bạn*"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Nhập lời chúc của bạn*"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /gửi lời chúc/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(weddingData.wishes[0].name),
      ).toBeInTheDocument();
    });
  });

  it("prefers wishes from the API over the seeded fallback", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        get: () =>
          Response.json({
            wishes: [
              {
                id: "api-1",
                name: "Khách API",
                message: "Chúc mừng từ API",
                avatar: "",
                createdAt: "2026-07-01T10:00:00+07:00",
              },
            ],
          }),
      }),
    );

    render(<WishesSection />);

    await waitFor(() => {
      expect(screen.getByText("Khách API")).toBeInTheDocument();
    });
    expect(
      screen.queryByText(weddingData.wishes[0].name),
    ).not.toBeInTheDocument();
  });

  it("submits a wish and shows it at the top of the list", async () => {
    const post = vi.fn(() => Response.json({ success: true }, { status: 201 }));
    vi.stubGlobal("fetch", mockFetch({ post }));

    const user = userEvent.setup();
    render(<WishesSection />);

    await user.type(
      screen.getByPlaceholderText("Nhập tên của bạn*"),
      "Bạn Thân",
    );
    await user.type(
      screen.getByPlaceholderText("Nhập lời chúc của bạn*"),
      "Trăm năm hạnh phúc nhé!",
    );
    await user.click(screen.getByRole("button", { name: /gửi lời chúc/i }));

    await waitFor(() => {
      expect(post).toHaveBeenCalled();
      expect(screen.getByText("Bạn Thân")).toBeInTheDocument();
      expect(screen.getByText("Trăm năm hạnh phúc nhé!")).toBeInTheDocument();
    });
  });

  it("keeps the submit button disabled until both fields are filled", async () => {
    const user = userEvent.setup();
    render(<WishesSection />);

    const button = screen.getByRole("button", { name: /gửi lời chúc/i });
    expect(button).toBeDisabled();

    await user.type(screen.getByPlaceholderText("Nhập tên của bạn*"), "A");
    expect(button).toBeDisabled();

    await user.type(
      screen.getByPlaceholderText("Nhập lời chúc của bạn*"),
      "Chúc mừng",
    );
    expect(button).toBeEnabled();
  });
});
