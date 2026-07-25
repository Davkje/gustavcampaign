import ContentBlock from "@/components/ContentBlock";
import type { PublicSection } from "@/lib/content";

export default function DynamicSection({
	section,
	index,
}: {
	section: PublicSection;
	index: number;
}) {
	if (section.subsections.length === 0) return null;

	return (
		<section
			id={`section-${section.id}`}
			className={`px-6 py-24 sm:py-24 ${
				index % 2 === 0 ? "bg-background" : "bg-background-elevated"
			}`}
		>
			<div className="mx-auto flex max-w-3xl flex-col gap-10">
				<h2 className="text-center font-display text-3xl text-accent sm:text-4xl">
					{section.heading}
				</h2>
				{section.subsections.map((sub) => (
					<div
						key={sub.id}
						className="flex flex-col gap-4 border-t border-border pt-8 first:border-t-0 first:pt-0"
					>
						<ContentBlock
							heading={sub.heading}
							text={sub.text}
							imageUrl={sub.imageUrl}
							imagePosition={sub.imagePosition}
							imageBorder={sub.imageBorder}
							audioUrl={sub.audioUrl}
						/>
					</div>
				))}
			</div>
		</section>
	);
}
