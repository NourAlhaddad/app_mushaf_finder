import { sampleProducts } from "./sample-products";
import type { MushafProduct } from "./types";

export interface CatalogueSource {
  getProducts(): readonly MushafProduct[];
}

export class LocalCatalogueSource implements CatalogueSource {
  constructor(private readonly products: readonly MushafProduct[] = sampleProducts) {}

  getProducts(): readonly MushafProduct[] {
    return this.products;
  }
}

export const localCatalogue = new LocalCatalogueSource();
