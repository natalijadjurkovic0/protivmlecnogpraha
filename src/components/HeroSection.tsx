import { motion } from "framer-motion";
import heroCow from "@/assets/hero-cow.jpg";
import { CrownDoodle, HeartDoodle, CloudDoodle, StarDoodle } from "./DoodleOverlays";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroCow}
          alt="Krava u kutiji na srpskom selu"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/20 to-background" />
      </div>

      {/* Floating doodles */}
      <CrownDoodle className="absolute top-[18%] left-[42%] md:left-[46%] z-20" />
      <HeartDoodle className="absolute top-[30%] right-[15%] z-20" />
      <HeartDoodle className="absolute top-[35%] right-[22%] z-20 scale-75 opacity-70" />
      <CloudDoodle className="absolute top-[10%] right-[10%] z-20 opacity-60" />
      <CloudDoodle className="absolute top-[8%] left-[5%] z-20 opacity-40 scale-75" />
      <StarDoodle className="absolute top-[25%] left-[10%] z-20" />
      <StarDoodle className="absolute top-[15%] right-[30%] z-20 scale-50 opacity-60" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-warm-white leading-tight mb-4">
            Mlečni{" "}
            <span className="font-handwritten text-primary text-6xl md:text-8xl lg:text-9xl">
              put
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="font-handwritten text-2xl md:text-4xl text-primary mt-4 max-w-2xl mx-auto"
        >
          "Uz pravo mleko nema straha,
          <br />
          bežimo od mlečnog praha"
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#story"
            className="px-8 py-4 bg-primary text-primary-foreground font-body font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            Saznaj više
          </a>
          <a
            href="/partner"
            className="px-8 py-4 border-2 border-warm-white text-warm-white font-body font-bold text-lg rounded-full hover:bg-warm-white hover:text-foreground transition-all"
          >
            Postani partner
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-warm-white/60 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-warm-white/60" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
