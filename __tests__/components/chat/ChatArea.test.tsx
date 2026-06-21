import { render, screen } from "@testing-library/react";
import { ChatArea } from "@/components/chat/ChatArea";
import type { Message } from "@/lib/types";

beforeAll(() => {
  // jsdom doesn't implement scrollIntoView
  Element.prototype.scrollIntoView = jest.fn();
});

const makeMsg = (id: string, role: "user" | "assistant", content: string): Message => ({
  id,
  conversationId: "c1",
  role,
  content,
  createdAt: `2026-06-21T00:00:0${id.slice(-1)}.000Z`,
});

describe("ChatArea", () => {
  it("renders one MessageBubble per message", () => {
    const messages: Message[] = [
      makeMsg("m1", "user", "first"),
      makeMsg("m2", "assistant", "second"),
      makeMsg("m3", "user", "third"),
    ];
    render(<ChatArea messages={messages} />);
    const bubbles = screen.getAllByTestId("message-bubble");
    expect(bubbles).toHaveLength(3);
  });

  it("renders a scrollable container", () => {
    render(<ChatArea messages={[]} />);
    const area = screen.getByTestId("chat-area");
    expect(area.className).toContain("overflow-y-auto");
  });

  it("renders the loading dots when isStreaming is true", () => {
    render(<ChatArea messages={[]} isStreaming />);
    expect(screen.getByTestId("loading-dots")).toBeInTheDocument();
  });

  it("does NOT render loading dots when isStreaming is false", () => {
    render(<ChatArea messages={[]} />);
    expect(screen.queryByTestId("loading-dots")).not.toBeInTheDocument();
  });

  it("renders nothing problematic when messages is empty", () => {
    render(<ChatArea messages={[]} />);
    expect(screen.queryAllByTestId("message-bubble")).toHaveLength(0);
  });
});
