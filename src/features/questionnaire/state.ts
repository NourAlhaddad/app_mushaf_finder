import type { FinderAnswers } from "../../domain/catalogue/types";

export interface FinderState {
  started: boolean;
  step: number;
  answers: FinderAnswers;
  showResults: boolean;
}

export type FinderAction =
  | { type: "start" }
  | { type: "answer"; value: Partial<FinderAnswers> }
  | { type: "back" }
  | { type: "continue" }
  | { type: "show-results" }
  | { type: "edit-answers" }
  | { type: "restart" };

export const initialFinderState: FinderState = {
  started: false,
  step: 0,
  answers: {},
  showResults: false,
};

export function hasCompleteAnswers(answers: FinderAnswers): boolean {
  return Boolean(
    answers.audience &&
      answers.language &&
      answers.riwayah &&
      answers.size &&
      answers.bookType &&
      answers.budget,
  );
}

export function isStepComplete(step: number, answers: FinderAnswers): boolean {
  switch (step) {
    case 0:
      return Boolean(answers.audience);
    case 1:
      return Boolean(answers.language);
    case 2:
      return Boolean(answers.riwayah);
    case 3:
      return Boolean(answers.size);
    case 4:
      return Boolean(answers.bookType && answers.budget);
    default:
      return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isOneOf(value: unknown, values: readonly string[]): boolean {
  return value === undefined || (typeof value === "string" && values.includes(value));
}

function isFinderAnswers(value: unknown): value is FinderAnswers {
  if (!isRecord(value)) return false;
  return (
    isOneOf(value.audience, ["child", "adult", "older-reader", "hifz", "beginner", "gift"]) &&
    isOneOf(value.language, ["ar", "en", "fr", "de", "es", "ru"]) &&
    isOneOf(value.riwayah, ["hafs", "warsh", "qalun", "al-douri", "other", "unsure"]) &&
    isOneOf(value.size, ["pocket", "personal", "standard", "large", "any"]) &&
    isOneOf(value.bookType, ["full", "part", "either"]) &&
    isOneOf(value.budget, ["under-25", "25-60", "over-60", "any"])
  );
}

function isFinderState(value: unknown): value is FinderState {
  if (!isRecord(value)) return false;
  return (
    typeof value.started === "boolean" &&
    typeof value.step === "number" &&
    Number.isInteger(value.step) &&
    value.step >= 0 &&
    value.step <= 4 &&
    isFinderAnswers(value.answers) &&
    typeof value.showResults === "boolean" &&
    (!value.showResults || (value.started && hasCompleteAnswers(value.answers)))
  );
}

export function finderReducer(
  state: FinderState,
  action: FinderAction,
): FinderState {
  switch (action.type) {
    case "start":
      return { ...state, started: true, showResults: false };
    case "answer":
      return {
        ...state,
        answers: { ...state.answers, ...action.value },
        showResults: false,
      };
    case "back":
      return { ...state, step: Math.max(0, state.step - 1), showResults: false };
    case "continue":
      if (!isStepComplete(state.step, state.answers)) return state;
      if (state.step === 4) {
        return hasCompleteAnswers(state.answers)
          ? { ...state, showResults: true }
          : state;
      }
      return { ...state, step: state.step + 1 };
    case "show-results":
      return hasCompleteAnswers(state.answers)
        ? { ...state, showResults: true }
        : state;
    case "edit-answers":
      return { ...state, step: 4, showResults: false };
    case "restart":
      return initialFinderState;
  }
}

export function loadFinderState(): FinderState {
  try {
    const stored = window.localStorage.getItem("mushaf-finder-progress");
    if (!stored) return initialFinderState;
    const parsed: unknown = JSON.parse(stored);
    if (isFinderState(parsed)) return parsed;
  } catch (error) {
    console.error("Could not read saved Mushaf Finder progress.", error);
  }
  return initialFinderState;
}

export function saveFinderState(state: FinderState): void {
  if (!state.started && !hasCompleteAnswers(state.answers)) {
    window.localStorage.removeItem("mushaf-finder-progress");
    return;
  }
  window.localStorage.setItem("mushaf-finder-progress", JSON.stringify(state));
}
