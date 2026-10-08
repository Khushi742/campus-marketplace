import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorNotice = params.error === "AccessDenied"
    ? "Please use your verified college Google account ending in @nmit.ac.in."
    : params.error
      ? "Google sign-in could not be completed. Please try again."
      : undefined;

  return (
    <LoginForm
      googleConfigured={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)}
      errorNotice={errorNotice}
      accessDenied={params.error === "AccessDenied"}
    />
  );
}
