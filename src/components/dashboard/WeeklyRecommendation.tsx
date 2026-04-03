import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const DAY_LABELS: Record<string, string> = {
  monday: "Ponedeljak",
  tuesday: "Utorak",
  wednesday: "Sreda",
  thursday: "Četvrtak",
  friday: "Petak",
  saturday: "Subota",
  sunday: "Nedelja",
};

interface PredictResponse {
  customer_message: string;
  peak_day: string;
}

const WeeklyRecommendation = () => {
  const [data, setData] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: fnData, error: fnErr } = await supabase.functions.invoke("predict-demand");
        if (fnErr) throw fnErr;
        const payload = fnData?.prediction || fnData;
        if (payload?.customer_message && payload?.peak_day) {
          setData(payload);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse p-6 rounded-2xl bg-card border-2 border-border h-32" />
        <div className="animate-pulse p-6 rounded-2xl bg-card border-2 border-border h-32" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-2xl bg-card border-2 border-border text-center">
        <p className="font-body text-sm text-muted-foreground">
          ⚠️ Nije moguće učitati preporuke. Pokušaj ponovo kasnije.
        </p>
      </div>
    );
  }

  const peakLabel = DAY_LABELS[data.peak_day.toLowerCase()] || data.peak_day;

  return (
    <div className="space-y-4">
      {/* Card 1 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-card border-2 border-border"
      >
        <h3 className="font-display text-lg font-bold text-foreground mb-2">
          🥛 Preporuka ove nedelje
        </h3>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          {data.customer_message}
        </p>
        <button className="mt-4 px-5 py-2 rounded-xl bg-primary/10 text-primary font-body text-sm font-semibold hover:bg-primary/20 transition-colors">
          Dodaj u sledeću dostavu
        </button>
      </motion.div>

      {/* Card 2 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-card border-2 border-border"
      >
        <h3 className="font-display text-lg font-bold text-foreground mb-2">
          📈 Povećana potražnja
        </h3>
        <p className="font-body text-sm text-muted-foreground">
          Najpopularniji dan ove nedelje je <strong className="text-foreground">{peakLabel}</strong>
        </p>
        <p className="font-body text-xs text-muted-foreground mt-1">
          Ako želiš dodatne litre — naruči na vreme
        </p>
        <button className="mt-4 px-5 py-2 rounded-xl bg-primary/10 text-primary font-body text-sm font-semibold hover:bg-primary/20 transition-colors">
          Naruči dodatno
        </button>
      </motion.div>
    </div>
  );
};

export default WeeklyRecommendation;
