export function normalizeStudentEmail(email: string | null | undefined): string {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

export function isAllowedGoogleStudent(
  email: string,
  emailVerified: boolean,
): boolean {
  return (
    emailVerified &&
    email.length <= 254 &&
    /^[^\s@]+@nmit\.ac\.in$/.test(email)
  );
}
