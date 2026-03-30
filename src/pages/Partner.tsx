import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import landscapeImg from "@/assets/rural-landscape.jpg";
import { StarDoodle, HeartDoodle } from "@/components/DoodleOverlays";

const Partner = () => {
  const [formData, setFormData] = useState({
    bpg: "",
    jmbg: "",
    ime: "",
    adresa: "",
    kapacitet: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will integrate with Supabase later
  };

  return (
    <div className="relative">
      <Navbar />

      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={landscapeImg}
            alt="Srpsko selo"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>

        {/* Floating doodles */}
        <StarDoodle className="absolute top-32 left-10 z-20 scale-150 hidden md:block" />
        <HeartDoodle className="absolute bottom-20 right-10 z-20 scale-125 hidden md:block" />

        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-xl mx-6"
        >
          <div className="glass-card rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <span className="font-handwritten text-2xl text-primary">Misija za tebe</span>
              <h1 className="font-display text-3xl md:text-4xl font-black text-warm-white mt-2">
                Postani Partner
              </h1>
              <p className="font-body text-warm-white/70 mt-3 text-sm">
                Popuni formular ispod i pridruži se mreži mlekara koja menja način na koji Srbija pije mleko.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-handwritten text-lg text-primary block mb-1">BPG</label>
                <input
                  type="text"
                  name="bpg"
                  value={formData.bpg}
                  onChange={handleChange}
                  placeholder="Broj poljoprivrednog gazdinstva"
                  className="w-full px-4 py-3 rounded-xl bg-warm-white/10 border border-warm-white/20 text-warm-white placeholder:text-warm-white/40 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="font-handwritten text-lg text-primary block mb-1">JMBG</label>
                <input
                  type="text"
                  name="jmbg"
                  value={formData.jmbg}
                  onChange={handleChange}
                  placeholder="Jedinstveni matični broj"
                  className="w-full px-4 py-3 rounded-xl bg-warm-white/10 border border-warm-white/20 text-warm-white placeholder:text-warm-white/40 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="font-handwritten text-lg text-primary block mb-1">Ime i Prezime</label>
                <input
                  type="text"
                  name="ime"
                  value={formData.ime}
                  onChange={handleChange}
                  placeholder="Vaše puno ime"
                  className="w-full px-4 py-3 rounded-xl bg-warm-white/10 border border-warm-white/20 text-warm-white placeholder:text-warm-white/40 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="font-handwritten text-lg text-primary block mb-1">Adresa</label>
                <input
                  type="text"
                  name="adresa"
                  value={formData.adresa}
                  onChange={handleChange}
                  placeholder="Adresa farme"
                  className="w-full px-4 py-3 rounded-xl bg-warm-white/10 border border-warm-white/20 text-warm-white placeholder:text-warm-white/40 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="font-handwritten text-lg text-primary block mb-1">Kapacitet (litara/dan)</label>
                <input
                  type="number"
                  name="kapacitet"
                  value={formData.kapacitet}
                  onChange={handleChange}
                  placeholder="Dnevni kapacitet mleka"
                  className="w-full px-4 py-3 rounded-xl bg-warm-white/10 border border-warm-white/20 text-warm-white placeholder:text-warm-white/40 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-primary-foreground font-body font-bold text-lg rounded-xl hover:scale-[1.02] transition-transform mt-4 shadow-lg"
              >
                Pošalji prijavu 🐄
              </button>
            </form>

            <p className="font-body text-warm-white/40 text-xs text-center mt-6">
              Vaši podaci su zaštićeni. Kontaktiraćemo vas u roku od 48h.
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Partner;
