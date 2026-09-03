import type { Product } from "../types/catalog";
import catalogImages from "./catalogImages.json";

export const DEFAULT_CATEGORIES = [
  "Bucket Hat",
  "Outdoor Sun Hat",
  "Baseball Cap",
  "Visor",
  "Kids Hat",
  "Wide Brim Sun Hat",
  "Fedora & Panama Hat",
  "Cowboy Hat",
  "Mexican Sombrero",
];

const CATEGORY_COPY: Record<string, string> = {
  "Bucket Hat": "Soft all-around bucket profile suited for casual, streetwear, and travel collections.",
  "Outdoor Sun Hat": "Functional outdoor hat with wider coverage, flap, mesh, or chin-strap details.",
  "Baseball Cap": "Classic front-bill cap silhouette for sports, resort, promotional, and casual assortments.",
  Visor: "Open-top sun visor style for lightweight outdoor, beach, and sports use.",
  "Kids Hat": "Playful children-focused style with softer proportions, bright colors, or character details.",
  "Wide Brim Sun Hat": "Wide-brim resort or garden hat designed for shade coverage and polished styling.",
  "Fedora & Panama Hat": "Structured brimmed style with fedora, panama, trilby, or boater-inspired shaping.",
  "Cowboy Hat": "Western-inspired raised-brim hat with shaped crown, decorative bands, or rodeo styling.",
  "Mexican Sombrero": "Traditional sombrero-style hat with an extra-wide circular brim and woven texture.",
};

function inRanges(value: number, ranges: Array<[number, number]>) {
  return ranges.some(([start, end]) => value >= start && value <= end);
}

function productNumberFromFilename(fileName: string) {
  return Number(fileName.match(/_(\d+)_2_gemini/)?.[1] ?? 0);
}

function getCategory(productNumber: number) {
  if (inRanges(productNumber, [[10, 16], [23, 27], [37, 45], [354, 355], [381, 384], [412, 422]])) {
    return "Bucket Hat";
  }

  if (inRanges(productNumber, [[17, 22], [28, 36], [46, 67]])) {
    return "Outdoor Sun Hat";
  }

  if (inRanges(productNumber, [[68, 144], [147, 245]])) {
    return "Baseball Cap";
  }

  if (inRanges(productNumber, [[145, 146], [365, 374]])) {
    return "Visor";
  }

  if (inRanges(productNumber, [[246, 249], [423, 442]])) {
    return "Mexican Sombrero";
  }

  if (inRanges(productNumber, [[250, 281]])) {
    return "Kids Hat";
  }

  if (inRanges(productNumber, [[282, 298], [305, 306], [309, 325]])) {
    return "Wide Brim Sun Hat";
  }

  if (inRanges(productNumber, [[299, 304], [307, 308], [326, 331], [348, 353], [356, 364], [375, 380], [385, 388]])) {
    return "Fedora & Panama Hat";
  }

  if (inRanges(productNumber, [[332, 347], [389, 411]])) {
    return "Cowboy Hat";
  }

  return "Bucket Hat";
}

function titleFor(category: string, productNumber: number) {
  return `${category} #${String(productNumber).padStart(3, "0")}`;
}

export const DEFAULT_PRODUCTS: Product[] = (catalogImages as string[]).map((fileName, index) => {
  const productNumber = productNumberFromFilename(fileName);
  const category = getCategory(productNumber);

  return {
    id: `hat-${String(productNumber).padStart(3, "0")}`,
    title: titleFor(category, productNumber),
    category,
    description: CATEGORY_COPY[category],
    sku: `DT-HAT-${String(productNumber).padStart(3, "0")}`,
    images: [`/images/catalog-web/${fileName}`],
    createdAt: new Date(Date.UTC(2026, 8, 3, 10, 0, index)).toISOString(),
  };
});
