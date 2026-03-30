import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StorySection from "@/components/StorySection";
import WindingRoad from "@/components/WindingRoad";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative">
      <Navbar />
      <WindingRoad />
      <HeroSection />
      <StorySection />
      <Footer />
    </div>
  );
};

export default Index;
