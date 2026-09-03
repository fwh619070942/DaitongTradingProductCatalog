export const FALLBACK_IMAGE = "/images/fallback.svg";

export function normalizeImagePath(value: string) {
  const imagePath = value.trim();

  if (!imagePath) {
    return "";
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }

  if (imagePath.startsWith("/")) {
    return imagePath;
  }

  if (imagePath.startsWith("images/")) {
    return `/${imagePath}`;
  }

  return `/images/${imagePath}`;
}
