import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SectionHeading } from "@/app/(app)/my-wedding/_components/section-heading";

describe("SectionHeading", () => {
  it("renders a heading with its label text", () => {
    render(<SectionHeading>THÔNG TIN LỄ CƯỚI</SectionHeading>);
    expect(screen.getByText("THÔNG TIN LỄ CƯỚI")).toBeInTheDocument();
  });
});
