import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import CompleteStudentProfileForm from "@/components/CompleteStudentProfileForm";
import { authOptions } from "@/auth";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CompleteProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await (await getPrisma()).user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, usn: true, degree: true, branch: true },
  });
  if (!user) {
    redirect("/login");
  }
  if (user.usn && user.degree && user.branch) {
    redirect("/marketplace");
  }

  return <CompleteStudentProfileForm user={user} />;
}
