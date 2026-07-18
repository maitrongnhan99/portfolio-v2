import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import GiftBox from "@/app/(app)/my-wedding/_components/gift-box";
import { weddingData } from "@/app/(app)/my-wedding/data";

describe("GiftBox", () => {
  it("renders the section heading and the envelope hint", () => {
    render(<GiftBox />);
    expect(screen.getByText("HỘP QUÀ MỪNG")).toBeInTheDocument();
    expect(screen.getByText("Nhấn để mở")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /mở hộp quà mừng/i }),
    ).toBeInTheDocument();
  });

  it("opens the modal with both banking QR codes when the envelope is clicked", async () => {
    const user = userEvent.setup();
    render(<GiftBox />);

    await user.click(screen.getByRole("button", { name: /mở hộp quà mừng/i }));

    const { groom, bride } = weddingData.gift;
    const { couple } = weddingData;

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText(`${couple.groom.role} - ${couple.groom.name}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${couple.bride.role} - ${couple.bride.name}`),
    ).toBeInTheDocument();

    expect(screen.getAllByText(groom.bank).length).toBeGreaterThan(0);
    expect(screen.getAllByText(bride.bank).length).toBeGreaterThan(0);
    expect(screen.getByText(groom.accountNumber)).toBeInTheDocument();

    const qrImages = screen.getAllByRole("img", { name: /mã qr/i });
    expect(qrImages).toHaveLength(2);

    expect(
      screen.getAllByRole("button", { name: /lưu qr/i }),
    ).toHaveLength(2);
  });
});
