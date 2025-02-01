export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  // If message is from today, show only time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // If message is from this year, show date without year
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  // Otherwise show full date
  return date.toLocaleDateString();
};
