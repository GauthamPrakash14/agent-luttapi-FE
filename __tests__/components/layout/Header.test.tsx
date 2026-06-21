import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/Header";

describe("Header", () => {
  it("renders the title", () => {
    render(<Header onMenuToggle={jest.fn()} />);
    expect(screen.getByRole("heading", { name: "Luttapi" })).toBeInTheDocument();
  });

  it("renders a custom title when provided", () => {
    render(<Header onMenuToggle={jest.fn()} title="Custom" />);
    expect(screen.getByRole("heading", { name: "Custom" })).toBeInTheDocument();
  });

  it("renders the hamburger button and fires onMenuToggle on click", async () => {
    const onMenuToggle = jest.fn();
    render(<Header onMenuToggle={onMenuToggle} />);
    await userEvent.click(
      screen.getByRole("button", { name: /open sidebar/i }),
    );
    expect(onMenuToggle).toHaveBeenCalledTimes(1);
  });

  it("has md:hidden class on the root so it is mobile-only", () => {
    render(<Header onMenuToggle={jest.fn()} />);
    const header = screen.getByTestId("header");
    expect(header.className).toContain("md:hidden");
  });

  it("renders the right slot when provided", () => {
    render(
      <Header
        onMenuToggle={jest.fn()}
        rightSlot={<span data-testid="right-slot">R</span>}
      />,
    );
    expect(screen.getByTestId("right-slot")).toBeInTheDocument();
  });
});
