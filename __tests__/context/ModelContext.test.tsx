import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ModelProvider,
  useModelContext,
} from "@/context/ModelContext";

const LOADED = [
  { name: "phi3.5", displayName: "Phi3.5" },
];

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      { name: "phi3.5", is_loaded: true, size_bytes: 0, pulled_at: new Date().toISOString() },
      { name: "llama3.2:3b", is_loaded: false, size_bytes: 0, pulled_at: new Date().toISOString() },
    ],
  } as Response) as unknown as typeof fetch;
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe("useModelContext", () => {
  it("throws when used outside ModelProvider", () => {
    // Suppress the noisy React error boundary log for this expected throw
    const originalError = console.error;
    console.error = jest.fn();
    try {
      expect(() => renderHook(() => useModelContext())).toThrow(
        /must be used within a ModelProvider/i,
      );
    } finally {
      console.error = originalError;
    }
  });
});

describe("ModelProvider", () => {
  it("reflects useModels() output: isLoading transitions from true to false and models populate", async () => {
    const { result } = renderHook(() => useModelContext(), {
      wrapper: ({ children }) => <ModelProvider>{children}</ModelProvider>,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.models).toEqual([]);
    expect(result.current.selectedModel).toBe("");

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.models).toEqual(LOADED);
  });

  it("defaults selectedModel to the first model name once loaded", async () => {
    const { result } = renderHook(() => useModelContext(), {
      wrapper: ({ children }) => <ModelProvider>{children}</ModelProvider>,
    });

    await waitFor(() => {
      expect(result.current.selectedModel).toBe(LOADED[0].name);
    });
  });

  it("setSelectedModel updates selectedModel", async () => {
    function Consumer() {
      const ctx = useModelContext();
      return (
        <div>
          <span data-testid="selected">{ctx.selectedModel}</span>
          <button
            type="button"
            onClick={() => ctx.setSelectedModel("custom-model")}
          >
            choose
          </button>
        </div>
      );
    }

    const user = userEvent.setup();
    render(
      <ModelProvider>
        <Consumer />
      </ModelProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("selected").textContent).toBe(
        LOADED[0].name,
      );
    });

    await user.click(screen.getByRole("button", { name: /choose/i }));

    expect(screen.getByTestId("selected").textContent).toBe("custom-model");
  });
});
