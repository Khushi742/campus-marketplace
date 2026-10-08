import Link from "next/link";
import { UserRound } from "lucide-react";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function RegisterPage() {
  const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.12),_transparent_35%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-12">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_32px_90px_-40px_rgba(79,70,229,0.4)]">
        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-200">
            <UserRound className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Join Campus Marketplace</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use your verified NMIT Google account. We will ask for your USN and engineering branch after sign-in.
          </p>
        </div>

        <GoogleAuthButton configured={googleConfigured} />

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link href="/login" className="font-semibold text-indigo-600">Sign in with Google</Link>
        </p>
      </div>
    </main>
  );
}
