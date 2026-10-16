const countryAliases = {
  usa: "United States",
  "united-states": "United States",
  "united-kingdom": "United Kingdom",
  uk: "United Kingdom",
  uae: "United Arab Emirates",
  korea: "South Korea",
  "south-korea": "South Korea",
  "new-zealand": "New Zealand",
  "papua-new-guinea": "Papua New Guinea",
  "south-africa": "South Africa",
  "costa-rica": "Costa Rica",
  "saudi-arabia": "Saudi Arabia",
};

export const regions = {
  africa: { label: "Africa", countries: ["South Africa", "Kenya", "Nigeria", "Ghana", "Uganda", "Tanzania", "Ethiopia", "Zimbabwe", "Egypt", "Morocco"] },
  asia: { label: "Asia", countries: ["India", "Japan", "Singapore", "Malaysia", "Indonesia", "Pakistan", "Vietnam", "Thailand", "Philippines", "Bangladesh", "China", "South Korea", "Saudi Arabia", "Qatar", "United Arab Emirates"] },
  europe: { label: "Europe", countries: ["United Kingdom", "Germany", "France", "Italy", "Spain", "Netherlands", "Sweden", "Switzerland", "Austria", "Belgium", "Norway", "Denmark", "Finland", "Portugal"] },
  "north-america": { label: "North America", countries: ["United States", "Canada", "Mexico", "Cuba", "Panama", "Costa Rica"] },
  "south-america": { label: "South America", countries: ["Argentina", "Brazil", "Chile", "Colombia", "Ecuador", "Peru", "Bolivia", "Paraguay", "Uruguay"] },
  oceania: { label: "Oceania", countries: ["Australia", "New Zealand", "Fiji", "Papua New Guinea"] },
};

export function formatLocationSlug(slug = "") {
  const normalized = decodeURIComponent(slug).toLowerCase().trim();
  if (countryAliases[normalized]) return countryAliases[normalized];
  return normalized.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function isRegionSlug(slug = "") {
  return Object.prototype.hasOwnProperty.call(regions, slug.toLowerCase());
}
