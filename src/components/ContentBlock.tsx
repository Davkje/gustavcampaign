import type { ImagePosition } from "@/lib/content";

export default function ContentBlock({
	heading,
	text,
	imageUrl,
	imagePosition,
}: {
	heading?: string;
	text: string;
	imageUrl: string | null;
	imagePosition: ImagePosition;
}) {
	if (!imageUrl) {
		return (
			<div>
				{heading && <h3 className="font-display text-lg text-foreground">{heading}</h3>}
				<p className="mt-3 whitespace-pre-line text-lg text-muted">{text}</p>
			</div>
		);
	}

	return (
		<div
			className={`flex flex-col gap-6 sm:items-center ${
				imagePosition === "left" ? "sm:flex-row-reverse" : "sm:flex-row"
			}`}
		>
			<div className="text-center sm:flex-1 sm:text-left">
				{heading && <h3 className="font-display text-lg text-foreground">{heading}</h3>}
				<p className="mt-3 whitespace-pre-line text-lg text-muted">{text}</p>
			</div>
			{/* eslint-disable-next-line @next/next/no-img-element -- uppladdad bild från Supabase Storage, ingen optimeringsvinst värd next/image-konfigurationen här */}
			<img
				src={imageUrl}
				alt=""
				loading="lazy"
				className="max-w-[400px] w-full rounded border border-border object-cover sm:flex-1"
			/>
		</div>
	);
}
