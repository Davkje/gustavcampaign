import Divider from "@/components/Divider";

export default function Hero({
	campaignName,
	subtitle,
	videoUrl,
}: {
	campaignName: string;
	subtitle: string;
	videoUrl: string | null;
}) {
	return (
		<section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
			{/* Fallback bakgrund tills videon finns på plats */}
			<div className="absolute inset-0 -z-20 bg-linear-to-b from-[#241b12] via-background to-background" />

			{/* Video laddas upp av Gustav via /admin och sparas i Supabase Storage */}
			{videoUrl && (
				<video
					className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
					src={videoUrl}
					autoPlay
					muted
					loop
					playsInline
				/>
			)}

			{/* Mörk overlay så texten alltid går att läsa, video eller ej */}
			<div className="absolute inset-0 -z-10 bg-linear-to-b from-black/70 via-black/50 to-background" />

			<div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
				<p className="text-sm uppercase tracking-[0.3em] text-accent">Session Zero</p>

				<h1 className="text-balance font-display text-2xl leading-tight text-foreground sm:text-5xl">
					Välkomna till den nya kampanjen
					{/* <span className="text-accent">{campaignName}</span> */}
				</h1>

				<Divider />

				<p className="max-w-md text-3xl text-muted">{subtitle}</p>
			</div>

			<div
				className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-accent/70"
				aria-hidden="true"
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
				>
					<path d="M12 4v16m0 0l-6-6m6 6l6-6" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
		</section>
	);
}
