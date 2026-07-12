import ContentBlock from "@/components/ContentBlock";
import type { ImagePosition } from "@/lib/content";

export default function Prep({
	prepText,
	imageUrl,
	imagePosition,
}: {
	prepText: string;
	imageUrl: string | null;
	imagePosition: ImagePosition;
}) {
	return (
		<section id="prep" className="bg-background px-6 py-24 sm:py-32">
			<div className="mx-auto flex max-w-3xl flex-col gap-8">
				<h2 className="text-center font-display text-3xl text-accent sm:text-4xl">Prep</h2>
				<ContentBlock text={prepText} imageUrl={imageUrl} imagePosition={imagePosition} />
			</div>
		</section>
	);
}
