export function getConferenceStartDate(dateText) {
  if (!dateText) return null;
  const match = String(dateText).trim().match(/^(\d{1,2})(?:st|nd|rd|th)?(?:\s*[–-]\s*\d{1,2}(?:st|nd|rd|th)?)?\s+([A-Za-z]+)\s+(\d{4})$/i);
  if (!match) return null;
  const monthIndex = new Date(`${match[2]} 1, ${match[3]}`).getMonth();
  if (Number.isNaN(monthIndex)) return null;
  const date = new Date(Number(match[3]), monthIndex, Number(match[1]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isUpcomingConference(conference, now = new Date()) {
  const startDate = getConferenceStartDate(conference?.date);
  if (!startDate) return false;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return startDate >= today;
}
