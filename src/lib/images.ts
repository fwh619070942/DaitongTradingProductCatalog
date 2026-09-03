export const FALLBACK_IMAGE = "/images/fallback.svg";

const EXTERNAL_IMAGE_PREFIXES = ["http://", "https://", "data:", "blob:"];

export function isExternalImage(value: string) {
  return EXTERNAL_IMAGE_PREFIXES.some((prefix) => value.startsWith(prefix));
}

export function publicImageUrl(value: string) {
  if (!value || isExternalImage(value)) {
    return value;
  }

  const baseUrl = import.meta.env.BASE_URL || "/";
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = value.startsWith("/") ? value.slice(1) : value;

  return `${normalizedBase}${normalizedPath}`;
}

export function normalizeImagePath(value: string) {
  const imagePath = value.trim();

  if (!imagePath) {
    return "";
  }

  if (isExternalImage(imagePath)) {
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
