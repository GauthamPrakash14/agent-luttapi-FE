import { render, screen } from "@testing-library/react";
import { ChatArea } from "@/components/chat/ChatArea";
import type { Message } from "@/lib/types";

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
  // scrollTop is a getter/setter in jsdom; stub scrollHeight so the setter works
  Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
    configurable: true,
    get() { return 0; },
  });
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

  it("renders a streaming bubble with loading dots when streamingContent is empty string", () => {
    render(<ChatArea messages={[]} streamingContent="" conversationId="c1" />);
    expect(screen.getByTestId("loading-dots")).toBeInTheDocument();
  });

  it("renders a streaming bubble with content when streamingContent is non-empty", () => {
    render(<ChatArea messages={[]} streamingContent="hello" conversationId="c1" />);
    expect(screen.getByTestId("message-bubble")).toBeInTheDocument();
  });

  it("does NOT render a streaming bubble when streamingContent is null", () => {
    render(<ChatArea messages={[]} streamingContent={null} />);
    expect(screen.queryByTestId("loading-dots")).not.toBeInTheDocument();
    expect(screen.queryAllByTestId("message-bubble")).toHaveLength(0);
  });

  it("renders nothing problematic when messages is empty", () => {
    render(<ChatArea messages={[]} />);
    expect(screen.queryAllByTestId("message-bubble")).toHaveLength(0);
  });
});
