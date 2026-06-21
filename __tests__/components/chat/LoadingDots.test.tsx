import { render, screen } from "@testing-library/react";
import { LoadingDots } from "@/components/chat/LoadingDots";

describe("LoadingDots", () => {
  it("renders 3 dots", () => {
    render(<LoadingDots />);
    const dots = screen.getAllByTestId("loading-dot");
    expect(dots).toHaveLength(3);
  });

  it("each dot has the animate-bounce class", () => {
    render(<LoadingDots />);
    const dots = screen.getAllByTestId("loading-dot");
    for (const d of dots) {
      expect(d.className).toContain("animate-bounce");
    }
  });

  it("has an accessible status role and label", () => {
    render(<LoadingDots />);
    const status = screen.getByRole("status", { name: /assistant is typing/i });
    expect(status).toBeInTheDocument();
  });
});
