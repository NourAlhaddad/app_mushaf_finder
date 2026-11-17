import { describe, expect, it } from "vitest";
import { sampleProducts, recommendationWeights } from "../catalogue/sample-products";
import type { FinderAnswers, MushafProduct } from "../catalogue/types";
import { recommendProducts } from "./recommend";

const completeAnswers: FinderAnswers = {
  audience: "adult",
  language: "en",
  riwayah: "hafs",
  size: "standard",
  bookType: "full",
  budget: "25-60",
};

describe("recommendProducts", () => {
  it("applies every selected compatibility filter before ranking", () => {
    const results = recommendProducts(sampleProducts, completeAnswers, recommendationWeights);

    expect(results.map(({ product }) => product.id)).toEqual(["demo-hafs-standard-en"]);
    expect(results[0].product.riwayah).toBe("hafs");
    expect(results[0].product.translationLanguages).toContain("en");
    expect(results[0].product.bookType).toBe("full");
    expect(results[0].product.price).toBeGreaterThanOrEqual(25);
    expect(results[0].product.price).toBeLessThanOrEqual(60);
  });

  it("does not mistake a part edition for a requested full Qur'an", () => {
    const results = recommendProducts(sampleProducts, {
      ...completeAnswers,
      bookType: "full",
      budget: "under-25",
      size: "any",
    }, recommendationWeights);

    expect(results).toHaveLength(0);
  });

  it("requires the selected riwayah and exact translation language", () => {
    const results = recommendProducts(sampleProducts, {
      ...completeAnswers,
      language: "fr",
      riwayah: "warsh",
      size: "any",
      budget: "any",
    }, recommendationWeights);

    expect(results.map(({ product }) => product.id)).toEqual(["demo-warsh-standard-fr"]);
  });

  it("prioritizes explicit Hifz and large-print features without inferring them", () => {
    const hifz = recommendProducts(sampleProducts, {
      ...completeAnswers,
      audience: "hifz",
      language: "ar",
      size: "any",
      budget: "any",
    }, recommendationWeights);
    const olderReader = recommendProducts(sampleProducts, {
      ...completeAnswers,
      audience: "older-reader",
      language: "fr",
      size: "any",
      budget: "any",
    }, recommendationWeights);

    expect(hifz[0].product.id).toBe("demo-hafs-memorization");
    expect(hifz[0].reasons).toContain("hifz-feature");
    expect(olderReader[0].product.id).toBe("demo-hafs-large-fr");
    expect(olderReader[0].reasons).toContain("large-print-feature");
    expect(olderReader[0].product.features).toContain("large-print");
  });

  it("excludes unavailable items and products with unknown required attributes", () => {
    const incompleteProduct: MushafProduct = {
      ...sampleProducts[0],
      id: "incomplete",
      riwayah: null,
      translationLanguages: null,
    };
    const results = recommendProducts(
      [...sampleProducts, incompleteProduct],
      completeAnswers,
      recommendationWeights,
    );

    expect(results.some(({ product }) => product.availability === false)).toBe(false);
    expect(results.some(({ product }) => product.id === "incomplete")).toBe(false);
  });

  it("returns no recommendations until every questionnaire answer is supplied", () => {
    expect(
      recommendProducts(sampleProducts, { audience: "adult" }, recommendationWeights),
    ).toEqual([]);
  });

  it("returns no matches for an empty catalogue", () => {
    expect(recommendProducts([], completeAnswers, recommendationWeights)).toEqual([]);
  });

  it("respects budget boundaries exactly", () => {
    const candidates: MushafProduct[] = [24.99, 25, 60, 60.01].map((price) => ({
      ...sampleProducts[0],
      id: `price-${price}`,
      price,
    }));
    const answers: FinderAnswers = {
      ...completeAnswers,
      size: "any",
      bookType: "either",
    };

    expect(
      recommendProducts(candidates, { ...answers, budget: "under-25" }, recommendationWeights)
        .map(({ product }) => product.price),
    ).toEqual([24.99]);
    expect(
      recommendProducts(candidates, { ...answers, budget: "25-60" }, recommendationWeights)
        .map(({ product }) => product.price),
    ).toEqual([25, 60]);
    expect(
      recommendProducts(candidates, { ...answers, budget: "over-60" }, recommendationWeights)
        .map(({ product }) => product.price),
    ).toEqual([60.01]);
  });

  it("uses injected scoring weights to change preference ranking", () => {
    const clearPrint: MushafProduct = {
      ...sampleProducts[0],
      id: "clear-print",
      price: 30,
      suitableFor: ["adult"],
      features: ["clear-print"],
    };
    const lowerPrice: MushafProduct = {
      ...sampleProducts[0],
      id: "lower-price",
      price: 20,
      suitableFor: ["adult"],
      features: [],
    };
    const answers: FinderAnswers = {
      ...completeAnswers,
      size: "standard",
      budget: "any",
    };

    const defaultRanking = recommendProducts(
      [clearPrint, lowerPrice],
      answers,
      recommendationWeights,
    );
    const noPrintPreference = recommendProducts(
      [clearPrint, lowerPrice],
      answers,
      { ...recommendationWeights, broadQuality: 0 },
    );

    expect(defaultRanking[0].product.id).toBe("clear-print");
    expect(noPrintPreference[0].product.id).toBe("lower-price");
    expect(() =>
      recommendProducts([clearPrint], answers, {
        audienceFit: 0,
        audienceFeature: 0,
        additionalSuitability: 0,
        broadQuality: 0,
      }),
    ).toThrow(RangeError);
  });
});
