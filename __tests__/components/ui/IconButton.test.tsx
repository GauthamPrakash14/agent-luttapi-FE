import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconButton } from "@/components/ui/IconButton";

describe("IconButton", () => {
  it("renders the icon and aria-label", () => {
    render(
      <IconButton
        icon={<svg data-testid="icon" />}
        label="Open menu"
      />,
    );
    const btn = screen.getByRole("button", { name: "Open menu" });
    expect(btn).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("uses label as the tooltip via title attribute", () => {
    render(<IconButton icon={<span />} label="Settings" />);
    expect(screen.getByRole("button")).toHaveAttribute("title", "Settings");
  });

  it("fires onClick", async () => {
    const onClick = jest.fn();
    render(<IconButton icon={<span />} label="X" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
