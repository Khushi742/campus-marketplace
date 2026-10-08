export const WISHLIST_STORAGE_KEY = "campus-marketplace-wishlist";
export const WISHLIST_CHANGE_EVENT = "campus-marketplace-wishlist-change";

export function getWishlistIds(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) ?? "[]");
    return Array.isArray(value) && value.every((id) => typeof id === "string") ? value : [];
  } catch {
    return [];
  }
}

export function setWishlistIds(ids: string[]): void {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([...new Set(ids)]));
  window.dispatchEvent(new Event(WISHLIST_CHANGE_EVENT));
}

export function toggleWishlistId(id: string): boolean {
  const ids = getWishlistIds();
  const isSaved = ids.includes(id);
  setWishlistIds(isSaved ? ids.filter((savedId) => savedId !== id) : [...ids, id]);
  return !isSaved;
}
