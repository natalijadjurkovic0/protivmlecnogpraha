import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StorySection from "@/components/StorySection";
import WindingRoad from "@/components/WindingRoad";
import FloatingDoodles from "@/components/FloatingDoodles";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative">
      <Navbar />
      <WindingRoad />
      <FloatingDoodles />
      <HeroSection />
      <StorySection />
      <Footer />
    </div>
  );
};

export default Index;
