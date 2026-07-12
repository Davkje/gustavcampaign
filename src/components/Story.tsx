import ContentBlock from "@/components/ContentBlock";
import type { ImagePosition } from "@/lib/content";

export default function Story({
	storyText,
	imageUrl,
	imagePosition,
	audioUrl,
}: {
	storyText: string;
	imageUrl: string | null;
	imagePosition: ImagePosition;
	audioUrl: string | null;
}) {
	return (
		<section id="story" className="bg-background-elevated px-6 py-24 sm:py-32">
			<div className="mx-auto flex max-w-3xl flex-col gap-8">
				<h2 className="text-center font-display text-3xl text-accent sm:text-4xl">Story</h2>
				{audioUrl && <audio src={audioUrl} controls className="w-full" />}
				<ContentBlock text={storyText} imageUrl={imageUrl} imagePosition={imagePosition} />
			</div>
		</section>
	);
}
