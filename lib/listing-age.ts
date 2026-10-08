const ageParts = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function formatListingAge(createdAt: string): string {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
  const units = [
    { seconds: 60 * 60 * 24 * 365, unit: "year" as const },
    { seconds: 60 * 60 * 24 * 30, unit: "month" as const },
    { seconds: 60 * 60 * 24 * 7, unit: "week" as const },
    { seconds: 60 * 60 * 24, unit: "day" as const },
    { seconds: 60 * 60, unit: "hour" as const },
    { seconds: 60, unit: "minute" as const },
  ];

  const age = units.find(({ seconds }) => elapsedSeconds >= seconds);
  if (!age) return "Listed just now";

  const value = Math.floor(elapsedSeconds / age.seconds);
  return `Listed ${ageParts.format(-value, age.unit)}`;
}
