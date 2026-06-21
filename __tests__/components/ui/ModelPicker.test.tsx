import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/context/ModelContext", () => ({
  useModelContext: jest.fn(),
}));

import { useModelContext } from "@/context/ModelContext";
import { ModelPicker } from "@/components/ui/ModelPicker";

const mockUseModelContext = useModelContext as jest.MockedFunction<
  typeof useModelContext
>;

const twoModels = [
  { name: "phi3.5", displayName: "Phi 3.5" },
  { name: "llama3.2:3b", displayName: "Llama 3.2 3B" },
];

beforeEach(() => {
  mockUseModelContext.mockReturnValue({
    models: twoModels,
    isLoading: false,
    selectedModel: "phi3.5",
    setSelectedModel: jest.fn(),
  });
});

describe("ModelPicker", () => {
  it("renders the selected model display name", () => {
    render(<ModelPicker />);
    expect(
      screen.getByRole("button", { name: /select model/i }),
    ).toHaveTextContent("Phi 3.5");
  });

  it("opens the dropdown on click", async () => {
    render(<ModelPicker />);
    await userEvent.click(screen.getByRole("button", { name: /select model/i }));
    expect(
      screen.getByRole("listbox", { name: /available models/i }),
    ).toBeInTheDocument();
  });

  it("lists all available models in the dropdown", async () => {
    render(<ModelPicker />);
    await userEvent.click(screen.getByRole("button", { name: /select model/i }));
    for (const m of twoModels) {
      expect(screen.getByRole("option", { name: m.displayName })).toBeInTheDocument();
    }
  });

  it("calls setSelectedModel and closes dropdown when an option is clicked", async () => {
    const setSelectedModel = jest.fn();
    mockUseModelContext.mockReturnValue({
      models: twoModels,
      isLoading: false,
      selectedModel: "phi3.5",
      setSelectedModel,
    });
    render(<ModelPicker />);
    await userEvent.click(screen.getByRole("button", { name: /select model/i }));
    await userEvent.click(screen.getByRole("option", { name: "Llama 3.2 3B" }));
    expect(setSelectedModel).toHaveBeenCalledWith("llama3.2:3b");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows Loading… and disables the trigger while isLoading", () => {
    mockUseModelContext.mockReturnValue({
      models: [],
      isLoading: true,
      selectedModel: "",
      setSelectedModel: jest.fn(),
    });
    render(<ModelPicker />);
    const btn = screen.getByRole("button", { name: /select model/i });
    expect(btn).toHaveTextContent("Loading…");
    expect(btn).toBeDisabled();
  });
});
