import AircraftScroll from "@/components/ui/AircraftScroll";
import SplitScreen from "@/components/ui/SplitScreen";
import { Philosophy } from "@/components/sections/Philosophy";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { ContactCta } from "@/components/sections/ContactCta";

export default function Home() {
  return (
    <>
      <AircraftScroll />
      <Philosophy />
      <Process />
      <SplitScreen />
      <Services />
      <FeaturedProjects />
      <Testimonials />
      <Faq />
      <ContactCta />
    </>
  );
}
