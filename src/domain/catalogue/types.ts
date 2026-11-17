export type Audience =
  | "child"
  | "adult"
  | "older-reader"
  | "hifz"
  | "beginner"
  | "gift";

export type Language = "ar" | "en" | "fr" | "de" | "es" | "ru";
export type Riwayah = "hafs" | "warsh" | "qalun" | "al-douri" | "other" | "unsure";
export type Size = "pocket" | "personal" | "standard" | "large" | "any";
export type BookType = "full" | "part" | "either";
export type Budget = "under-25" | "25-60" | "over-60" | "any";
export type InterfaceLocale = "en" | "fr" | "ar";

export interface FinderAnswers {
  audience?: Audience;
  language?: Language;
  riwayah?: Riwayah;
  size?: Size;
  bookType?: BookType;
  budget?: Budget;
}

export interface MushafProduct {
  id: string;
  name: string;
  publisher: string | null;
  translationLanguages: Language[] | null;
  riwayah: Exclude<Riwayah, "unsure"> | null;
  size: Exclude<Size, "any"> | null;
  dimensions: string | null;
  bookType: Exclude<BookType, "either"> | null;
  suitableFor: Audience[];
  features: string[];
  description: string;
  price: number;
  currency: string;
  availability: boolean | null;
  image: string | null;
  productUrl: string | null;
  isDemo: boolean;
}

export interface ScoringWeights {
  audienceFit: number;
  audienceFeature: number;
  additionalSuitability: number;
  broadQuality: number;
}

export type RecommendationReason =
  | "audience"
  | "hifz-feature"
  | "large-print-feature"
  | "suitable-for"
  | "clear-print"
  | "within-budget";

export interface ProductRecommendation {
  product: MushafProduct;
  score: number;
  reasons: RecommendationReason[];
}
