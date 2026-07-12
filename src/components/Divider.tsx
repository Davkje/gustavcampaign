export default function Divider() {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden="true">
      <span className="h-px w-10 bg-accent/40" />
      <span className="h-1.5 w-1.5 rotate-45 bg-accent" />
      <span className="h-px w-10 bg-accent/40" />
    </div>
  );
}
