import ContentBlock from "@/components/ContentBlock";
import type { ImagePosition } from "@/lib/content";

export default function Schema({
	scheduleText,
	imageUrl,
	imagePosition,
}: {
	scheduleText: string;
	imageUrl: string | null;
	imagePosition: ImagePosition;
}) {
	return (
		<section id="schema" className="bg-background-elevated px-6 py-24 sm:py-32">
			<div className="mx-auto flex max-w-3xl flex-col gap-8">
				<h2 className="text-center font-display text-3xl text-accent sm:text-4xl">Schema</h2>
				<ContentBlock text={scheduleText} imageUrl={imageUrl} imagePosition={imagePosition} />
			</div>
		</section>
	);
}
