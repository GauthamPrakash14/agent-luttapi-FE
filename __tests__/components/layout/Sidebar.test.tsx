import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sidebar } from "@/components/layout/Sidebar";
import { MOCK_CONVERSATIONS } from "@/lib/mock-data";

describe("Sidebar", () => {
  const baseProps = {
    conversations: MOCK_CONVERSATIONS,
    isOpen: true,
    onClose: jest.fn(),
    onNewChat: jest.fn(),
    onSelect: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders every conversation title", () => {
    render(<Sidebar {...baseProps} />);
    for (const c of MOCK_CONVERSATIONS) {
      expect(screen.getByText(c.title)).toBeInTheDocument();
    }
  });

  it("fires onNewChat when the New Chat button is clicked", async () => {
    render(<Sidebar {...baseProps} />);
    await userEvent.click(screen.getByRole("button", { name: /new chat/i }));
    expect(baseProps.onNewChat).toHaveBeenCalledTimes(1);
  });

  it("highlights the active conversation", () => {
    render(<Sidebar {...baseProps} activeId={MOCK_CONVERSATIONS[1].id} />);
    const activeRow = screen
      .getByText(MOCK_CONVERSATIONS[1].title)
      .closest('[role="button"]');
    expect(activeRow).toHaveAttribute("data-active", "true");
  });

  it("renders a footer slot when provided", () => {
    render(
      <Sidebar
        {...baseProps}
        footer={<div data-testid="footer-content">FOOT</div>}
      />,
    );
    expect(screen.getByTestId("footer-content")).toBeInTheDocument();
  });

  it("shows an empty message when there are no conversations", () => {
    render(<Sidebar {...baseProps} conversations={[]} />);
    expect(screen.getByText(/no conversations yet/i)).toBeInTheDocument();
  });

  it("calls onClose when the backdrop is clicked", async () => {
    render(<Sidebar {...baseProps} />);
    await userEvent.click(screen.getByTestId("sidebar-backdrop"));
    expect(baseProps.onClose).toHaveBeenCalled();
  });
});
