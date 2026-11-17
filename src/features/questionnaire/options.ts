import type {
  Audience,
  Budget,
  BookType,
  Language,
  Riwayah,
  Size,
} from "../../domain/catalogue/types";

export const audienceOptions: { value: Audience; icon: string }[] = [
  { value: "child", icon: "✦" },
  { value: "adult", icon: "◉" },
  { value: "older-reader", icon: "◌" },
  { value: "hifz", icon: "❋" },
  { value: "beginner", icon: "☾" },
  { value: "gift", icon: "◇" },
];

export const languageOptions: { value: Language; icon: string }[] = [
  { value: "ar", icon: "ع" },
  { value: "en", icon: "En" },
  { value: "fr", icon: "Fr" },
  { value: "de", icon: "De" },
  { value: "es", icon: "Es" },
  { value: "ru", icon: "Ru" },
];

export const riwayahOptions: { value: Riwayah; icon: string }[] = [
  { value: "hafs", icon: "١" },
  { value: "warsh", icon: "٢" },
  { value: "qalun", icon: "٣" },
  { value: "al-douri", icon: "٤" },
  { value: "other", icon: "…" },
  { value: "unsure", icon: "?" },
];

export const sizeOptions: { value: Size; icon: string }[] = [
  { value: "pocket", icon: "▯" },
  { value: "personal", icon: "▯" },
  { value: "standard", icon: "▯" },
  { value: "large", icon: "▯" },
  { value: "any", icon: "✧" },
];

export const bookTypeOptions: { value: BookType; icon: string }[] = [
  { value: "full", icon: "▤" },
  { value: "part", icon: "▥" },
  { value: "either", icon: "✧" },
];

export const budgetOptions: { value: Budget; icon: string }[] = [
  { value: "under-25", icon: "＄" },
  { value: "25-60", icon: "＄＄" },
  { value: "over-60", icon: "＄＄＄" },
  { value: "any", icon: "✧" },
];
