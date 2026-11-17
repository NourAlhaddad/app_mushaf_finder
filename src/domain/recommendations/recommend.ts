import type {
  Audience,
  Budget,
  FinderAnswers,
  MushafProduct,
  ProductRecommendation,
  RecommendationReason,
  ScoringWeights,
} from "../catalogue/types";

function isWithinBudget(price: number, budget: Budget | undefined): boolean {
  switch (budget) {
    case "under-25":
      return price < 25;
    case "25-60":
      return price >= 25 && price <= 60;
    case "over-60":
      return price > 60;
    default:
      return true;
  }
}

function isTranslationMatch(
  product: MushafProduct,
  language: FinderAnswers["language"],
): boolean {
  if (!language) return true;
  if (product.translationLanguages === null) return false;
  if (language === "ar") return product.translationLanguages.length === 0;
  return product.translationLanguages.includes(language);
}

function priorityFeature(
  audience: Audience,
  product: MushafProduct,
): RecommendationReason | null {
  const features = new Set(product.features);
  if (audience === "hifz" && features.has("memorization-layout")) {
    return "hifz-feature";
  }
  if (audience === "older-reader" && features.has("large-print")) {
    return "large-print-feature";
  }
  return null;
}

function scoreProduct(
  product: MushafProduct,
  audience: Audience,
  weights: ScoringWeights,
  budget: Budget,
  maximum: number,
): ProductRecommendation {
  const reasons: RecommendationReason[] = [];
  const audienceMatched = product.suitableFor.includes(audience);
  const featureReason = priorityFeature(audience, product);
  const clearPrint = product.features.includes("clear-print");
  let score = 0;

  if (audienceMatched) {
    score += weights.audienceFit;
    reasons.push("audience");
  }
  if (featureReason) {
    score += weights.audienceFeature;
    reasons.push(featureReason);
  }
  if (audienceMatched && product.suitableFor.length > 1) {
    score += weights.additionalSuitability;
    reasons.push("suitable-for");
  }
  if (clearPrint) {
    score += weights.broadQuality;
    reasons.push("clear-print");
  }
  if (budget !== "any") {
    reasons.push("within-budget");
  }

  return { product, score: Math.round((score / maximum) * 100), reasons };
}

export function recommendProducts(
  products: readonly MushafProduct[],
  answers: FinderAnswers,
  weights: ScoringWeights,
): ProductRecommendation[] {
  if (
    !answers.audience ||
    !answers.language ||
    !answers.riwayah ||
    !answers.size ||
    !answers.bookType ||
    !answers.budget
  ) {
    return [];
  }
  const { audience, language, riwayah, size, bookType, budget } = answers;
  const weightValues = [
    weights.audienceFit,
    weights.audienceFeature,
    weights.additionalSuitability,
    weights.broadQuality,
  ];
  const maximumWeight = weightValues.reduce((total, weight) => total + weight, 0);
  if (
    weightValues.some((weight) => !Number.isFinite(weight) || weight < 0) ||
    maximumWeight === 0
  ) {
    throw new RangeError("Recommendation weights must be finite, non-negative, and not all zero.");
  }

  const eligible = products.filter((product) => {
    if (product.availability === false) return false;
    if (product.riwayah !== riwayah && riwayah !== "unsure") {
      return false;
    }
    if (!isTranslationMatch(product, language)) return false;
    if (size !== "any" && product.size !== size) return false;
    if (bookType !== "either" && product.bookType !== bookType) {
      return false;
    }
    return isWithinBudget(product.price, budget);
  });

  return eligible
    .map((product) => scoreProduct(product, audience, weights, budget, maximumWeight))
    .sort((left, right) => right.score - left.score || left.product.price - right.product.price);
}
