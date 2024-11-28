export function formatToHumanReadableDate(isoDate) {
  if (!isoDate) return "";

  const date = new Date(isoDate);

  // Format the date in a more readable format
  const readableDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format the time in a more readable format
  const readableTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

  return `${readableDate}, ${readableTime}`; // Combine date and time
}
