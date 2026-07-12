import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { getSiteContent } from "@/lib/content";
import { logoutAction } from "@/app/actions/auth";
import AdminForm from "@/components/admin/AdminForm";

export default async function AdminPage() {
	await requireAdmin();
	const content = await getSiteContent();

	return (
		<main className="min-h-screen bg-background px-6 py-16">
			<div className="mx-auto flex max-w-3xl flex-col gap-10">
				<div className="flex items-center justify-between">
					<h1 className="font-display text-3xl text-accent">Redigera sidan</h1>
					<div className="flex items-center gap-4 text-sm">
						<Link href="/" className="text-muted underline hover:text-foreground">
							Till sidan
						</Link>
						<form action={logoutAction}>
							<button type="submit" className="text-muted underline hover:text-foreground">
								Logga ut
							</button>
						</form>
					</div>
				</div>
				<AdminForm initialContent={content} />
			</div>
		</main>
	);
}
