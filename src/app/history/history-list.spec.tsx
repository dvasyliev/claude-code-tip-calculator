import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HistoryList } from "./history-list";
import type { HistoryEntry } from "./history.types";

const e1: HistoryEntry = {
  bill: 50,
  tip: 15,
  people: 2,
  totalPerPerson: 28.75,
};
const e2: HistoryEntry = { bill: 20, tip: 10, people: 1, totalPerPerson: 22 };

describe("HistoryList", () => {
  it("renders nothing when empty", () => {
    const { container } = render(
      <HistoryList entries={[]} onClear={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders heading, one list item per entry", () => {
    render(<HistoryList entries={[e1, e2]} onClear={vi.fn()} />);
    expect(
      screen.getByRole("heading", { name: "History" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("shows the entry values", () => {
    render(<HistoryList entries={[e1]} onClear={vi.fn()} />);
    const item = screen.getByRole("listitem");
    expect(item).toHaveTextContent("50.00");
    expect(item).toHaveTextContent("15%");
    expect(item).toHaveTextContent("2 people");
    expect(item).toHaveTextContent("28.75");
  });

  it('shows "1 person" for a single person', () => {
    render(<HistoryList entries={[e2]} onClear={vi.fn()} />);
    expect(screen.getByRole("listitem")).toHaveTextContent("1 person");
  });

  it("Clear calls onClear", async () => {
    const onClear = vi.fn();
    render(<HistoryList entries={[e1]} onClear={onClear} />);
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(onClear).toHaveBeenCalledOnce();
  });
});
