import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessageInput } from "@/components/chat/MessageInput";

describe("MessageInput", () => {
  it("disables the send button when empty", () => {
    render(<MessageInput onSend={jest.fn()} />);
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).toBeDisabled();
  });

  it("enables the send button when there is non-whitespace text", async () => {
    render(<MessageInput onSend={jest.fn()} />);
    const input = screen.getByRole("textbox", { name: /message/i });
    await userEvent.type(input, "hi");
    expect(
      screen.getByRole("button", { name: /send message/i }),
    ).not.toBeDisabled();
  });

  it("calls onSend with trimmed content when the button is clicked", async () => {
    const onSend = jest.fn();
    render(<MessageInput onSend={onSend} />);
    const input = screen.getByRole("textbox", { name: /message/i });
    await userEvent.type(input, "  hello world  ");
    await userEvent.click(
      screen.getByRole("button", { name: /send message/i }),
    );
    expect(onSend).toHaveBeenCalledWith("hello world");
  });

  it("clears the input after sending", async () => {
    render(<MessageInput onSend={jest.fn()} />);
    const input = screen.getByRole("textbox", {
      name: /message/i,
    }) as HTMLTextAreaElement;
    await userEvent.type(input, "hi");
    await userEvent.click(
      screen.getByRole("button", { name: /send message/i }),
    );
    expect(input.value).toBe("");
  });

  it("fires onSend on Enter (without Shift)", async () => {
    const onSend = jest.fn();
    render(<MessageInput onSend={onSend} />);
    const input = screen.getByRole("textbox", { name: /message/i });
    await userEvent.type(input, "ping{Enter}");
    expect(onSend).toHaveBeenCalledWith("ping");
  });

  it("inserts a newline on Shift+Enter and does NOT fire onSend", async () => {
    const onSend = jest.fn();
    render(<MessageInput onSend={onSend} />);
    const input = screen.getByRole("textbox", {
      name: /message/i,
    }) as HTMLTextAreaElement;
    await userEvent.type(input, "line1{Shift>}{Enter}{/Shift}line2");
    expect(onSend).not.toHaveBeenCalled();
    expect(input.value).toContain("\n");
  });

  it("does not fire onSend on Enter if the input is only whitespace", async () => {
    const onSend = jest.fn();
    render(<MessageInput onSend={onSend} />);
    const input = screen.getByRole("textbox", { name: /message/i });
    await userEvent.type(input, "   {Enter}");
    expect(onSend).not.toHaveBeenCalled();
  });
});
