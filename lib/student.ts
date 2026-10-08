export const engineeringDegrees = ["BE", "BTech"] as const;

export const engineeringBranches = [
  "Computer Science and Engineering",
  "Information Science and Engineering",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Artificial Intelligence and Machine Learning",
  "Data Science",
] as const;

export function isValidUsn(usn: string): boolean {
  return /^[A-Z]{2}\d{2}[A-Z]{2,4}\d{3}$/.test(usn);
}
