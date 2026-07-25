import Hero from "@/components/Hero";
import SectionNav from "@/components/SectionNav";
import DynamicSection from "@/components/DynamicSection";
import Footer from "@/components/Footer";
import { getSiteContent, getSections } from "@/lib/content";

export default async function Home() {
	const [content, sections] = await Promise.all([getSiteContent(), getSections()]);

	return (
		<>
			<Hero
				campaignName={content.campaignName}
				subtitle={content.subtitle}
				videoUrl={content.videoUrl}
			/>
			<SectionNav sections={sections} />
			{sections.map((section, index) => (
				<DynamicSection key={section.id} section={section} index={index} />
			))}
			<Footer closingText={content.closingText} sessionZeroDetails={content.sessionZeroDetails} />
		</>
	);
}
