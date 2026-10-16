const STORAGE_KEY = "aca-saved-conferences-v1";

export function getSavedConferenceSlugs() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export function isConferenceSaved(slug) {
  return getSavedConferenceSlugs().includes(slug);
}

export function toggleSavedConference(slug) {
  const current = getSavedConferenceSlugs();
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("aca-saved-conferences-updated", { detail: next }));
  }
  return next;
}
