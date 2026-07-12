import Link from "next/link";
import Divider from "@/components/Divider";

export default function Footer({
  closingText,
  sessionZeroDetails,
}: {
  closingText: string;
  sessionZeroDetails: string;
}) {
  return (
    <footer className="bg-background-elevated px-6 py-24 text-center sm:py-32">
      <div className="mx-auto max-w-xl">
        <h2 className="font-display text-2xl text-foreground sm:text-3xl">
          {closingText}
        </h2>
        <div className="mt-6">
          <Divider />
        </div>
        <p className="mt-6 text-muted">{sessionZeroDetails}</p>
      </div>
      <Link
        href="/admin"
        className="mt-16 inline-block text-xs text-muted/40 hover:text-muted"
      >
        Admin
      </Link>
    </footer>
  );
}
