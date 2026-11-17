import type {
  Audience,
  Budget,
  Language,
  RecommendationReason,
  Riwayah,
  Size,
} from "../domain/catalogue/types";

export interface OptionCopy {
  label: string;
  description: string;
}

export interface Messages {
  brand: string;
  welcomeEyebrow: string;
  welcomeTitle: string;
  welcomeBody: string;
  start: string;
  resume: string;
  minute: string;
  step: string;
  chooseOne: string;
  back: string;
  continue: string;
  restart: string;
  editAnswers: string;
  welcomeQuestion: string;
  languageQuestion: string;
  narrationQuestion: string;
  narrationHelp: string;
  sizeQuestion: string;
  finalQuestion: string;
  readerGroup: string;
  languageGroup: string;
  narrationGroup: string;
  sizeGroup: string;
  bookTypeGroup: string;
  budgetGroup: string;
  resultsTitle: string;
  resultsSubtitle: string;
  bestMatch: string;
  suitableAlternative: string;
  score: string;
  publisher: string;
  notListed: string;
  narrationFact: string;
  languageFact: string;
  sizeFact: string;
  typeFact: string;
  stock: string;
  unavailable: string;
  stockUnknown: string;
  whyMatch: string;
  noMatchesTitle: string;
  noMatchesBody: string;
  assistance: string;
  sampleNotice: string;
  sampleProduct: string;
  samplePublisher: string;
  coverPlaceholder: string;
  itemPart: string;
  itemFull: string;
  buyLink: string;
  homeLabel: string;
  interfaceLanguage: string;
  footerNote: string;
  audienceReasons: Record<RecommendationReason, string>;
  audiences: Record<Audience, OptionCopy>;
  languages: Record<Language, OptionCopy>;
  riwayahs: Record<Riwayah, OptionCopy>;
  sizes: Record<Size, OptionCopy>;
  bookTypes: Record<"full" | "part" | "either", OptionCopy>;
  budgets: Record<Budget, OptionCopy>;
}

export const en: Messages = {
  brand: "Mushaf Finder",
  welcomeEyebrow: "A thoughtful place to begin",
  welcomeTitle: "Find the Mushaf that feels right for you.",
  welcomeBody:
    "A few simple questions help you explore editions by language, narration, size and budget—with clear reasons behind every suggestion.",
  start: "Start finding your Mushaf",
  resume: "Resume your finder",
  minute: "About 1 minute",
  step: "Question",
  chooseOne: "Choose one",
  back: "Back",
  continue: "Continue",
  restart: "Start again",
  editAnswers: "Change my answers",
  welcomeQuestion: "Who are you choosing a Mushaf for?",
  languageQuestion: "Which language would you like alongside Arabic?",
  narrationQuestion: "Which narration (riwayah) do you read?",
  narrationHelp:
    "Riwayah is a transmitted style of Qur'anic recitation. Hafs is common in North America; Warsh is common in North and West Africa.",
  sizeQuestion: "What size would suit you?",
  finalQuestion: "Full Qur'an or a part, and what is your budget?",
  readerGroup: "Who is it for?",
  languageGroup: "Translation language",
  narrationGroup: "Narration",
  sizeGroup: "Mushaf size",
  bookTypeGroup: "Edition type",
  budgetGroup: "Budget (CAD)",
  resultsTitle: "Your suggested editions",
  resultsSubtitle:
    "Ranked by how well the listed product details fit your answers. Only compatible editions are shown.",
  bestMatch: "Best match",
  suitableAlternative: "Suitable alternative",
  score: "Match",
  publisher: "Publisher",
  notListed: "Not listed",
  narrationFact: "Riwayah",
  languageFact: "Language",
  sizeFact: "Size",
  typeFact: "Edition",
  stock: "In stock",
  unavailable: "Out of stock",
  stockUnknown: "Availability not confirmed",
  whyMatch: "Why it may suit you",
  noMatchesTitle: "No editions match every selected requirement",
  noMatchesBody:
    "We have not relaxed your language, narration, size, edition type, budget or availability choices. Change an answer to explore other compatible editions, or ask for help.",
  assistance: "Ask for help on WhatsApp",
  sampleNotice:
    "Sample catalogue for local demonstration only. Products, prices and availability are fictional.",
  sampleProduct: "Demonstration product",
  samplePublisher: "Demonstration publisher",
  coverPlaceholder: "Sample cover",
  itemPart: "Part",
  itemFull: "Full Qur'an",
  buyLink: "View product",
  homeLabel: "Book Hub",
  interfaceLanguage: "Interface language",
  footerNote: "A helpful starting point for choosing your next Mushaf.",
  audienceReasons: {
    audience: "Listed as suitable for your reader",
    "hifz-feature": "Includes a memorization-focused layout",
    "large-print-feature": "Specifically marked as large print",
    "suitable-for": "Also suits more than one reading need",
    "clear-print": "Marked as having clear print",
    "within-budget": "Within your selected budget",
  },
  audiences: {
    child: { label: "A child or young learner", description: "For a young reader beginning their journey." },
    adult: { label: "An adult, for daily reading", description: "For a comfortable everyday reading copy." },
    "older-reader": { label: "An older reader — large print", description: "Prioritize products explicitly marked large print." },
    hifz: { label: "Someone memorizing (Hifz)", description: "Look for memorization-specific features." },
    beginner: { label: "A new Muslim or beginner", description: "For someone learning to read or explore." },
    gift: { label: "A gift", description: "A thoughtful edition for someone special." },
  },
  languages: {
    ar: { label: "Arabic only", description: "Arabic text without a translation." },
    en: { label: "English translation", description: "Arabic text with English translation." },
    fr: { label: "French translation", description: "Arabic text with French translation." },
    de: { label: "German translation", description: "Arabic text with German translation." },
    es: { label: "Spanish translation", description: "Arabic text with Spanish translation." },
    ru: { label: "Russian translation", description: "Arabic text with Russian translation." },
  },
  riwayahs: {
    hafs: { label: "Hafs", description: "Hafs 'an Asim." },
    warsh: { label: "Warsh", description: "Warsh 'an Nafi'." },
    qalun: { label: "Qalun", description: "Qalun 'an Nafi'." },
    "al-douri": { label: "Al-Douri", description: "Al-Douri narration." },
    other: { label: "Another reading", description: "A different named narration or reading." },
    unsure: { label: "Not sure", description: "Show editions without filtering by narration." },
  },
  sizes: {
    pocket: { label: "Pocket", description: "Around 8–10 cm wide; easy to carry." },
    personal: { label: "Personal", description: "Around 12–14 cm; light for travel." },
    standard: { label: "Standard", description: "Around 17 × 24 cm; a classic size." },
    large: { label: "Large", description: "25 cm and up; offers a larger format." },
    any: { label: "Any size", description: "Show all known sizes." },
  },
  bookTypes: {
    full: { label: "The full Qur'an", description: "A complete Mushaf edition." },
    part: { label: "A part to start", description: "For example, Juz Amma or a surah." },
    either: { label: "Either", description: "Show complete editions and parts." },
  },
  budgets: {
    "under-25": { label: "Under $25", description: "Less than C$25." },
    "25-60": { label: "$25–$60", description: "From C$25 to C$60." },
    "over-60": { label: "Over $60", description: "More than C$60." },
    any: { label: "Any budget", description: "Do not filter by price." },
  },
};
