"use server";

import { redirect } from "next/navigation";
import {
  createAdminSession,
  deleteAdminSession,
} from "@/lib/auth/session";

export type LoginState = { error?: string } | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0) {
    return { error: "Ange lösenordet." };
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Fel lösenord." };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await deleteAdminSession();
  redirect("/admin/login");
}
