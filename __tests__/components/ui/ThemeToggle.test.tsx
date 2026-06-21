import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {ui}
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  it("renders a button without crashing", () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("becomes clickable after mount (mounted guard releases)", async () => {
    renderWithTheme(<ThemeToggle />);
    // After effects run, the button is not disabled
    const btn = await screen.findByRole("button", {
      name: /switch to (light|dark) theme/i,
    });
    expect(btn).not.toBeDisabled();
    // Clicking should not throw
    await userEvent.click(btn);
  });

  it("renders an icon (sun or moon) after mount", async () => {
    renderWithTheme(<ThemeToggle />);
    // One of the two icons should be present
    const sun = screen.queryByTestId("sun-icon");
    const moon = await screen.findByTestId(/sun-icon|moon-icon/);
    expect(sun || moon).toBeTruthy();
  });
});
