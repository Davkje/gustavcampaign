import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { getSiteContent, getEditableSections } from "@/lib/content";
import { logoutAction } from "@/app/actions/auth";
import AdminEditor from "@/components/admin/AdminEditor";

export default async function AdminPage() {
	await requireAdmin();
	const [content, sections] = await Promise.all([getSiteContent(), getEditableSections()]);

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

				<AdminEditor initialContent={content} initialSections={sections} />

				<Link
					href="/"
					className="self-center rounded border border-border px-6 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
				>
					Till sidan
				</Link>
			</div>
		</main>
	);
}
