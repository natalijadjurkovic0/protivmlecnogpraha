import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const AI_PREDICT_URL = "https://mlecniput-1.onrender.com/api/predict-demand";

interface DayForecast {
  day: string;
  liters: number;
  trend: string;
}

interface Prediction {
  weekly_forecast: DayForecast[];
  peak_day: string;
  farmer_message: string;
  customer_message: string;
}

const DemandForecast = () => {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndPredict = async () => {
      setLoading(true);
      setError(null);

      try {
        // KORAK 1: Učitaj podatke iz Supabase
        const [subsRes, ordersRes] = await Promise.all([
          supabase.from("subscriptions").select("*").eq("status", "active"),
          supabase.from("orders").select("*"),
        ]);

        if (subsRes.error) throw subsRes.error;
        if (ordersRes.error) throw ordersRes.error;

        const subscriptions = subsRes.data || [];
        const orders = ordersRes.data || [];

        // KORAK 2: Prosledi podatke ka AI API-ju
        const response = await fetch(AI_PREDICT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptions, orders }),
        });

        if (!response.ok) throw new Error("Greška pri predikciji");

        const json = await response.json();
        const pred: Prediction = json.prediction ?? json;
        setPrediction(pred);
      } catch (err: any) {
        console.error("DemandForecast error:", err);
        setError("Nije moguće učitati prognozu.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndPredict();
  }, []);

  if (loading) {
    return (
      <section className="py-12 px-4 max-w-4xl mx-auto text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3 mx-auto" />
          <div className="h-40 bg-muted rounded" />
        </div>
      </section>
    );
  }

  if (error || !prediction) {
    return (
      <section className="py-12 px-4 max-w-4xl mx-auto text-center text-muted-foreground">
        {error || "Nema podataka."}
      </section>
    );
  }

  const maxLiters = Math.max(...prediction.weekly_forecast.map((d) => d.liters), 1);

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">📊 Nedeljna prognoza potražnje</h2>
      <p className="text-center text-muted-foreground mb-8">
        {prediction.customer_message}
      </p>

      <div className="flex items-end justify-between gap-2 h-48 mb-6">
        {prediction.weekly_forecast.map((day, i) => {
          const heightPct = maxLiters > 0 ? (day.liters / maxLiters) * 100 : 0;
          const isPeak = day.day === prediction.peak_day;
          return (
            <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
              <span className="text-xs font-medium mb-1">{day.liters}L</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(heightPct, 4)}%` }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`w-full rounded-t-md ${isPeak ? "bg-primary" : "bg-primary/40"}`}
              />
              <span className="text-[11px] mt-1 text-muted-foreground truncate w-full text-center">
                {day.day.slice(0, 3)}
              </span>
            </div>
          );
        })}
      </div>

      {prediction.peak_day && prediction.peak_day !== "N/A" && (
        <p className="text-center text-sm text-primary font-medium">
          🔝 Najveća potražnja: {prediction.peak_day}
        </p>
      )}
    </section>
  );
};

export default DemandForecast;
