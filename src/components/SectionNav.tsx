const LINKS = [
  { href: "#om-varlden", label: "Om världen" },
  { href: "#story", label: "Story" },
  { href: "#prep", label: "Prep" },
  { href: "#schema", label: "Schema" },
  { href: "#era-karaktarer", label: "Era karaktärer" },
  { href: "#forbered-din-karaktar", label: "Förbered din karaktär" },
];

export default function SectionNav() {
  return (
    <nav className="border-y border-border bg-background px-6 py-4">
      <ul className="mx-auto flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-2 text-sm uppercase tracking-wider">
        {LINKS.map((link) => (
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
