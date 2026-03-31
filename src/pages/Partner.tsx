import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import landscapeImg from "@/assets/rural-landscape.jpg";
import { StarDoodle, HeartDoodle } from "@/components/DoodleOverlays";

const Partner = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    bpg: "",
    jmbg: "",
    ime: "",
    adresa: "",
    kapacitet: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bpg || !formData.jmbg || !formData.ime || !formData.adresa || !formData.kapacitet) {
      toast({ title: "Greška", description: "Sva polja su obavezna.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("partner_applications").insert({
      bpg: formData.bpg.trim(),
      jmbg: formData.jmbg.trim(),
      full_name: formData.ime.trim(),
      address: formData.adresa.trim(),
      capacity_liters_per_day: Number(formData.kapacitet),
    });

    if (error) {
      toast({ title: "Greška", description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "Prijava poslata! 🎉", description: "Kontaktiraćemo vas u roku od 48h." });
    }
    setLoading(false);
  };

  return (
    <div className="relative">
      <Navbar />

      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20">
        <div className="absolute inset-0">
          <img src={landscapeImg} alt="Srpsko selo" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>

        <StarDoodle className="absolute top-32 left-10 z-20 scale-150 hidden md:block" />
        <HeartDoodle className="absolute bottom-20 right-10 z-20 scale-125 hidden md:block" />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-xl mx-6"
        >
          <div className="glass-card rounded-3xl p-8 md:p-12">
            {submitted ? (
              <div className="text-center py-8">
                <p className="text-5xl mb-4">🐄</p>
                <h2 className="font-display text-3xl font-black text-warm-white">Prijava primljena!</h2>
                <p className="font-body text-warm-white/70 mt-3">Kontaktiraćemo vas u roku od 48 sati.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <span className="font-handwritten text-2xl text-primary">Misija za tebe</span>
                  <h1 className="font-display text-3xl md:text-4xl font-black text-warm-white mt-2">Postani Partner</h1>
                  <p className="font-body text-warm-white/70 mt-3 text-sm">
                    Popuni formular ispod i pridruži se mreži mlekara koja menja način na koji Srbija pije mleko.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {[
                    { label: "BPG", name: "bpg", type: "text", placeholder: "Broj poljoprivrednog gazdinstva" },
                    { label: "JMBG", name: "jmbg", type: "text", placeholder: "Jedinstveni matični broj" },
                    { label: "Ime i Prezime", name: "ime", type: "text", placeholder: "Vaše puno ime" },
                    { label: "Adresa", name: "adresa", type: "text", placeholder: "Adresa farme" },
                    { label: "Kapacitet (litara/dan)", name: "kapacitet", type: "number", placeholder: "Dnevni kapacitet mleka" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="font-handwritten text-lg text-primary block mb-1">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl bg-warm-white/10 border border-warm-white/20 text-warm-white placeholder:text-warm-white/40 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary text-primary-foreground font-body font-bold text-lg rounded-xl hover:scale-[1.02] transition-transform mt-4 shadow-lg disabled:opacity-50"
                  >
                    {loading ? "Šalje se..." : "Pošalji prijavu 🐄"}
                  </button>
                </form>

                <p className="font-body text-warm-white/40 text-xs text-center mt-6">
                  Vaši podaci su zaštićeni. Kontaktiraćemo vas u roku od 48h.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Partner;
