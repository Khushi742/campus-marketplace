import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verification?: string; verified?: string; email?: string }>;
}) {
  const params = await searchParams;
  let verificationNotice: string | undefined;

  if (params.verification === "pending") {
    verificationNotice = `Check ${params.email ?? "your college email"} and click the verification link before signing in.`;
  } else if (params.verified === "1") {
    verificationNotice = "Email verified. Sign in to continue to the marketplace.";
  } else if (params.verification === "expired") {
    verificationNotice = "That verification link has expired. Please create your account again.";
  } else if (params.verification === "invalid") {
    verificationNotice = "That verification link is invalid or has already been used.";
  }

  return <LoginForm verificationNotice={verificationNotice} />;
}
