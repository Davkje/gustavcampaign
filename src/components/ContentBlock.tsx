import AudioPlayer from "@/components/AudioPlayer";
import type { ImagePosition } from "@/lib/content";

export default function ContentBlock({
	heading,
	text,
	imageUrl,
	imagePosition,
	imageBorder,
	audioUrl,
}: {
	heading?: string;
	text: string;
	imageUrl: string | null;
	imagePosition: ImagePosition;
	imageBorder: boolean;
	audioUrl?: string | null;
}) {
	const headingEl = heading && (
		<h3 className="font-display text-2xl text-foreground text-center">{heading}</h3>
	);
	const audioEl = audioUrl && <AudioPlayer src={audioUrl} />;
	const paragraph = <p className="whitespace-pre-line text-lg text-muted">{text}</p>;

	if (!imageUrl) {
		return (
			<div className="text-left">
				{headingEl}
				{audioEl && <div className="mt-3">{audioEl}</div>}
				<div className="mt-3">{paragraph}</div>
			</div>
		);
	}

	const resolvedImageUrl = imageUrl;

	function renderImage(extraClassName: string, zoom = false) {
		return (
			<div className={`rounded ${imageBorder ? "border border-border" : ""} ${extraClassName}`}>
				<div className="h-full w-full overflow-hidden rounded">
					{/* eslint-disable-next-line @next/next/no-img-element -- uppladdad bild från Supabase Storage, ingen optimeringsvinst värd next/image-konfigurationen här */}
					<img
						src={resolvedImageUrl}
						alt=""
						loading="lazy"
						className={`h-full w-full object-cover ${zoom ? "scale-125" : ""}`}
					/>
				</div>
			</div>
		);
	}

	if (imagePosition === "top" || imagePosition === "bottom") {
		return (
			<div className="flex flex-col items-center gap-3 text-left">
				{headingEl}
				{audioEl}
				<div className="flex flex-col items-center gap-6">
					{imagePosition === "top" && renderImage("w-full h-52", true)}
					{paragraph}
					{imagePosition === "bottom" && renderImage("w-full")}
				</div>
			</div>
		);
	}

	return (
		<div
			className={`flex flex-col items-center gap-6 ${
				imagePosition === "left" ? "sm:flex-row-reverse" : "sm:flex-row"
			}`}
		>
			<div className="flex flex-col gap-3 text-left sm:flex-1">
				{headingEl}
				{audioEl}
				{paragraph}
			</div>
			<div className="sm:flex-1">{renderImage("w-full")}</div>
		</div>
	);
}
