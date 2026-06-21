import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SidebarItem } from "@/components/layout/SidebarItem";
import type { Conversation } from "@/lib/types";

const conv: Conversation = {
  id: "abc-123",
  title: "Hello world",
  model: "phi3.5",
  createdAt: "2026-06-21T08:00:00.000Z",
  updatedAt: "2026-06-21T08:00:00.000Z",
};

describe("SidebarItem", () => {
  it("renders the conversation title", () => {
    render(
      <SidebarItem
        conversation={conv}
        onSelect={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("calls onSelect when the row is clicked", async () => {
    const onSelect = jest.fn();
    render(
      <SidebarItem
        conversation={conv}
        onSelect={onSelect}
        onDelete={jest.fn()}
      />,
    );
    // Click on the title text (inside the row button)
    await userEvent.click(screen.getByText("Hello world"));
    expect(onSelect).toHaveBeenCalledWith("abc-123");
  });

  it("calls onDelete and not onSelect when delete icon is clicked", async () => {
    const onSelect = jest.fn();
    const onDelete = jest.fn();
    render(
      <SidebarItem
        conversation={conv}
        onSelect={onSelect}
        onDelete={onDelete}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: /delete conversation/i }),
    );
    expect(onDelete).toHaveBeenCalledWith("abc-123");
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("applies the truncate class to long titles", () => {
    const longConv: Conversation = {
      ...conv,
      title:
        "A really really really long title that should be visually truncated",
    };
    render(
      <SidebarItem
        conversation={longConv}
        onSelect={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    const title = screen.getByText(longConv.title);
    expect(title.className).toContain("truncate");
  });

  it("marks itself active via data-active when isActive is true", () => {
    render(
      <SidebarItem
        conversation={conv}
        isActive
        onSelect={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    const row = screen.getByText("Hello world").closest('[role="button"]');
    expect(row).toHaveAttribute("data-active", "true");
  });
});
