import { render, screen } from "@testing-library/react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import type { Message } from "@/lib/types";

const userMsg: Message = {
  id: "u1",
  conversationId: "c1",
  role: "user",
  content: "Hello there",
  createdAt: "2026-06-21T00:00:00.000Z",
};

const asstMsg: Message = {
  id: "a1",
  conversationId: "c1",
  role: "assistant",
  content: "Hi! How can I help?",
  createdAt: "2026-06-21T00:00:01.000Z",
};

describe("MessageBubble", () => {
  it("renders user content with right-aligned wrapper and 'You' label", () => {
    render(<MessageBubble message={userMsg} />);
    const wrapper = screen.getByTestId("message-bubble");
    expect(wrapper).toHaveAttribute("data-role", "user");
    expect(wrapper.className).toContain("justify-end");
    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText("Hello there")).toBeInTheDocument();
  });

  it("renders assistant content with left-aligned wrapper and 'Assistant' label", () => {
    render(<MessageBubble message={asstMsg} />);
    const wrapper = screen.getByTestId("message-bubble");
    expect(wrapper).toHaveAttribute("data-role", "assistant");
    expect(wrapper.className).toContain("justify-start");
    expect(screen.getByText("Assistant")).toBeInTheDocument();
    expect(screen.getByText("Hi! How can I help?")).toBeInTheDocument();
  });

  it("preserves newlines via whitespace-pre-wrap", () => {
    const multiline: Message = {
      ...asstMsg,
      content: "line one\nline two",
    };
    render(<MessageBubble message={multiline} />);
    const bubble = screen.getByText(/line one/);
    expect(bubble.textContent).toContain("\n");
  });
});
