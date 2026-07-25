import type { PublicSection } from "@/lib/content";

export default function SectionNav({
  sections,
}: {
  sections: PublicSection[];
}) {
  const links = sections
    .filter((section) => section.subsections.length > 0)
    .map((section) => ({
      href: `#section-${section.id}`,
      label: section.heading,
    }));

  if (links.length === 0) return null;

  return (
    <nav className="border-y border-border bg-background px-6 py-4">
      <ul className="mx-auto flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-2 text-sm uppercase tracking-wider">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-muted transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
