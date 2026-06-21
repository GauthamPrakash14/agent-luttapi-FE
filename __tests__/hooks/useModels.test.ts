import { renderHook, waitFor } from "@testing-library/react";
import { useModels } from "@/hooks/useModels";

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      {
        name: "phi3.5",
        is_loaded: true,
        size_bytes: 0,
        pulled_at: new Date().toISOString(),
      },
      {
        name: "llama3.2:3b",
        is_loaded: false,
        size_bytes: 0,
        pulled_at: new Date().toISOString(),
      },
    ],
  } as Response) as unknown as typeof fetch;
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe("useModels", () => {
  it("is loading initially", () => {
    const { result } = renderHook(() => useModels());
    expect(result.current.isLoading).toBe(true);
  });

  it("returns only loaded models after fetch", async () => {
    const { result } = renderHook(() => useModels());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.models).toHaveLength(1);
    expect(result.current.models[0].name).toBe("phi3.5");
  });

  it("derives displayName from model name", async () => {
    const { result } = renderHook(() => useModels());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.models[0].displayName).toBe("Phi3.5");
  });

  it("has null error on success", async () => {
    const { result } = renderHook(() => useModels());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeNull();
  });
});
