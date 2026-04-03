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

const DAY_SHORT: Record<string, string> = {
  monday: "Pon",
  tuesday: "Uto",
  wednesday: "Sre",
  thursday: "Čet",
  friday: "Pet",
  saturday: "Sub",
  sunday: "Ned",
};

interface ForecastDay {
  day: string;
  liters: number;
}

interface PredictResponse {
  weekly_forecast?: ForecastDay[];
  customer_message: string;
  peak_day: string;
}

const WeeklyRecommendation = () => {
  const [data, setData] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fnData, error: fnErr } = await supabase.functions.invoke("predict-demand");
        if (fnErr) throw fnErr;
        const payload = fnData?.prediction || fnData;
        if (payload?.peak_day) {
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
    fetchData();
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

  const forecast = data.weekly_forecast || [];
  const peakLabel = DAY_LABELS[data.peak_day.toLowerCase()] || data.peak_day;

  // Generate custom message from weekly_forecast data
  let generatedMessage = data.customer_message || "";
  if (forecast.length > 0) {
    const liters = forecast.map((f) => f.liters);
    const maxLiters = Math.max(...liters);
    const minLiters = Math.min(...liters);
    const avg = liters.reduce((a, b) => a + b, 0) / liters.length;
    const peakEntry = forecast.find(
      (f) => f.day.toLowerCase() === data.peak_day.toLowerCase()
    ) || forecast.reduce((a, b) => (a.liters > b.liters ? a : b));
    const peakDayLabel = DAY_LABELS[peakEntry.day.toLowerCase()] || peakEntry.day;

    if (maxLiters > avg) {
      const pctDiff = Math.round(((maxLiters - minLiters) / minLiters) * 100);
      generatedMessage = `⚠️ Sledeće nedelje se očekuje povećana potražnja za mlekom. Najpopularniji dan biće ${peakDayLabel} sa ${pctDiff}% više narudžbina nego inače — poruči na vreme!`;
    } else {
      const pctDiff = Math.round(((avg - maxLiters) / avg) * 100) || 0;
      generatedMessage = `✅ Sledeće nedelje očekujemo mirnu nedelju. Potražnja će biti ${pctDiff}% niža nego inače — savršeno vreme da isprobaš novi proizvod.`;
    }
  }

  // Mini chart data
  const maxLiters = forecast.length > 0 ? Math.max(...forecast.map((f) => f.liters), 1) : 1;

  return (
    <div className="space-y-4">
      {/* Card 1 - Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-card border-2 border-border"
      >
        <h3 className="font-display text-lg font-bold text-foreground mb-2">
          🥛 Preporuka ove nedelje
        </h3>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          {generatedMessage}
        </p>
      </motion.div>

      {/* Card 2 - Peak demand with mini chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-card border-2 border-border"
      >
        <h3 className="font-display text-lg font-bold text-foreground mb-2">
          📈 Povećana potražnja
        </h3>
        <p className="font-body text-sm text-muted-foreground mb-4">
          Najpopularniji dan ove nedelje je <strong className="text-foreground">{peakLabel}</strong>
        </p>

        {forecast.length > 0 && (
          <div className="flex items-end justify-between gap-2 h-24">
            {forecast.map((item, i) => {
              const pct = (item.liters / maxLiters) * 100;
              const isPeak = item.day.toLowerCase() === data.peak_day.toLowerCase();
              return (
                <div key={item.day} className="flex flex-col items-center flex-1 h-full justify-end">
                  <motion.div
                    className={`w-full max-w-[32px] rounded-t-md ${isPeak ? "bg-primary" : "bg-secondary"}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(pct, 5)}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  />
                  <span className={`mt-1 text-[10px] font-semibold ${isPeak ? "text-primary" : "text-muted-foreground"}`}>
                    {DAY_SHORT[item.day.toLowerCase()] || item.day}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WeeklyRecommendation;
