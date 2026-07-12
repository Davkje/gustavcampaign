import ContentBlock from "@/components/ContentBlock";
import type { ImagePosition } from "@/lib/content";

export default function WorldInfo({
	continentText,
	continentImageUrl,
	continentImagePosition,
	countryText,
	countryImageUrl,
	countryImagePosition,
	regionText,
	regionImageUrl,
	regionImagePosition,
	audioUrl,
}: {
	continentText: string;
	continentImageUrl: string | null;
	continentImagePosition: ImagePosition;
	countryText: string;
	countryImageUrl: string | null;
	countryImagePosition: ImagePosition;
	regionText: string;
	regionImageUrl: string | null;
	regionImagePosition: ImagePosition;
	audioUrl: string | null;
}) {
	return (
		<section id="om-varlden" className="bg-background px-6 py-24 sm:py-32">
			<div className="mx-auto flex max-w-3xl flex-col gap-10">
				<h2 className="text-center font-display text-3xl text-accent sm:text-4xl">Om världen</h2>
				{/* TODO: plats för karta över Occidens/Dylorien */}

				{audioUrl && <audio src={audioUrl} controls className="w-full" />}

				<ContentBlock
					heading="Kontinenten"
					text={continentText}
					imageUrl={continentImageUrl}
					imagePosition={continentImagePosition}
				/>
				<ContentBlock
					heading="Landet"
					text={countryText}
					imageUrl={countryImageUrl}
					imagePosition={countryImagePosition}
				/>
				<ContentBlock
					heading="Regioner"
					text={regionText}
					imageUrl={regionImageUrl}
					imagePosition={regionImagePosition}
				/>
			</div>
		</section>
	);
}
