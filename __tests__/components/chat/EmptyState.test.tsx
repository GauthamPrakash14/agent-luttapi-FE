import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/chat/EmptyState";

describe("EmptyState", () => {
  it("renders the default heading", () => {
    render(<EmptyState />);
    expect(
      screen.getByRole("heading", { name: /how can i help you today/i }),
    ).toBeInTheDocument();
  });

  it("uses a custom heading when provided", () => {
    render(<EmptyState heading="Ask me anything" />);
    expect(
      screen.getByRole("heading", { name: "Ask me anything" }),
    ).toBeInTheDocument();
  });

  it("renders the model name when modelDisplayName is provided", () => {
    render(<EmptyState modelDisplayName="Phi 3.5" />);
    expect(screen.getByText("Phi 3.5")).toBeInTheDocument();
  });

  it("renders a bot icon when modelDisplayName is provided", () => {
    const { container } = render(<EmptyState modelDisplayName="Phi 3.5" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("does not render model section when modelDisplayName is omitted", () => {
    render(<EmptyState />);
    // No svg icon and no model name span should appear
    const { container } = render(<EmptyState />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("renders no suggested prompts list", () => {
    render(<EmptyState />);
    expect(screen.queryByRole("list")).toBeNull();
  });
});
