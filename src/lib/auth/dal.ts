import "server-only";
import { redirect } from "next/navigation";
import { isAdminSessionValid } from "@/lib/auth/session";

// Verifierar admin-sessionen på riktigt (inte bara det optimistiska
// cookie-checket i proxy.ts). Använd i admin-sidan och alla Server Actions
// som skriver data.
export async function requireAdmin() {
  const valid = await isAdminSessionValid();
  if (!valid) {
    redirect("/admin/login");
  }
}
