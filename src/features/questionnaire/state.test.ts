import { describe, expect, it } from "vitest";
import { finderReducer, initialFinderState } from "./state";

describe("finderReducer", () => {
  it("preserves previous answers when navigating backward", () => {
    const first = finderReducer(initialFinderState, { type: "start" });
    const withAudience = finderReducer(first, {
      type: "answer",
      value: { audience: "child" },
    });
    const secondStep = finderReducer(withAudience, { type: "continue" });
    const withLanguage = finderReducer(secondStep, {
      type: "answer",
      value: { language: "fr" },
    });
    const back = finderReducer(withLanguage, { type: "back" });

    expect(back.step).toBe(0);
    expect(back.answers).toEqual({ audience: "child", language: "fr" });
  });

  it("does not advance or show results until required answers are complete", () => {
    const started = finderReducer(initialFinderState, { type: "start" });

    expect(finderReducer(started, { type: "continue" })).toEqual(started);
    expect(finderReducer(started, { type: "show-results" })).toEqual(started);
  });

  it("requires both final-step choices before showing results", () => {
    let state = finderReducer(initialFinderState, { type: "start" });
    const answers = [
      { audience: "adult" as const },
      { language: "en" as const },
      { riwayah: "hafs" as const },
      { size: "standard" as const },
    ];

    for (const answer of answers) {
      state = finderReducer(state, { type: "answer", value: answer });
      state = finderReducer(state, { type: "continue" });
    }

    expect(state.step).toBe(4);
    state = finderReducer(state, {
      type: "answer",
      value: { bookType: "full" },
    });
    expect(finderReducer(state, { type: "continue" }).showResults).toBe(false);

    state = finderReducer(state, {
      type: "answer",
      value: { budget: "any" },
    });
    expect(finderReducer(state, { type: "continue" }).showResults).toBe(true);
  });
});
