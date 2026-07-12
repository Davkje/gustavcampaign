import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6">
      <h1 className="font-display text-3xl text-accent">Admin</h1>
      <LoginForm />
    </main>
  );
}
