export default function AudioPlayer({ src }: { src: string }) {
  return (
    <audio
      src={src}
      controls
      style={{ colorScheme: "dark" }}
      className="h-8 w-full max-w-64 accent-accent"
    />
  );
}
