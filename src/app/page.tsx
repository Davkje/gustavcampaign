import Hero from "@/components/Hero";
import SectionNav from "@/components/SectionNav";
import WorldInfo from "@/components/WorldInfo";
import Story from "@/components/Story";
import Prep from "@/components/Prep";
import Schema from "@/components/Schema";
import PartyBackground from "@/components/PartyBackground";
import CharacterQuestions from "@/components/CharacterQuestions";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/content";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <>
      <Hero
        campaignName={content.campaignName}
        subtitle={content.subtitle}
        videoUrl={content.videoUrl}
      />
      <SectionNav />
      <WorldInfo
        continentText={content.continentText}
        continentImageUrl={content.continentImageUrl}
        continentImagePosition={content.continentImagePosition}
        countryText={content.countryText}
        countryImageUrl={content.countryImageUrl}
        countryImagePosition={content.countryImagePosition}
        regionText={content.regionText}
        regionImageUrl={content.regionImageUrl}
        regionImagePosition={content.regionImagePosition}
        audioUrl={content.worldAudioUrl}
      />
      <Story
        storyText={content.storyText}
        imageUrl={content.storyImageUrl}
        imagePosition={content.storyImagePosition}
        audioUrl={content.storyAudioUrl}
      />
      <Prep
        prepText={content.prepText}
        imageUrl={content.prepImageUrl}
        imagePosition={content.prepImagePosition}
      />
      <Schema
        scheduleText={content.scheduleText}
        imageUrl={content.scheduleImageUrl}
        imagePosition={content.scheduleImagePosition}
      />
      <PartyBackground />
      <CharacterQuestions />
      <Footer
        closingText={content.closingText}
        sessionZeroDetails={content.sessionZeroDetails}
      />
    </>
  );
}
