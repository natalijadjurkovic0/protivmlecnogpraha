import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

const DAYS_OF_WEEK = [
  { label: "Pon", full: "Ponedeljak", value: "monday" },
  { label: "Uto", full: "Utorak", value: "tuesday" },
  { label: "Sre", full: "Sreda", value: "wednesday" },
  { label: "Čet", full: "Četvrtak", value: "thursday" },
  { label: "Pet", full: "Petak", value: "friday" },
  { label: "Sub", full: "Subota", value: "saturday" },
  { label: "Ned", full: "Nedelja", value: "sunday" },
];

const DriverDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [scheduledDays, setScheduledDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [routeGenerated, setRouteGenerated] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("driver_schedules")
      .select("day_of_week")
      .eq("driver_id", user.id)
      .then(({ data }) => {
        if (data) setScheduledDays(data.map((d: any) => d.day_of_week));
        setLoading(false);
      });
  }, [user]);

  const handleGenerateRoute = () => {
    setGenerating(true);
    setRouteGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setRouteGenerated(true);
    }, 3000);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="font-handwritten text-2xl text-primary">
          Učitavanje... 🚛
        </motion.p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <Navbar />

      {/* Winding road background */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        <svg width="100%" height="100%" viewBox="0 0 400 900" fill="none" preserveAspectRatio="none">
          <path
            d="M200 0 Q300 100 150 200 Q50 300 250 400 Q350 500 150 600 Q50 700 200 800 Q300 900 200 1000"
            stroke="hsl(45, 90%, 63%)"
            strokeWidth="6"
            strokeDasharray="12 8"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16 max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-handwritten text-xl text-primary">~ na putu ~</p>
          <h1 className="font-display text-3xl font-black text-foreground">Vozač Dashboard</h1>
          <button onClick={signOut} className="mt-3 px-4 py-1.5 border border-border text-muted-foreground font-body text-xs rounded-lg hover:bg-muted transition-colors">
            Odjavi se
          </button>
        </div>

        {/* Schedule */}
        <div className="mb-8 p-6 rounded-2xl bg-card border-2 border-border">
          <h2 className="font-display text-xl font-bold text-foreground mb-1">Moji Radni Dani</h2>
          <p className="font-handwritten text-lg text-primary mb-4">~ tvoj nedeljni raspored ~</p>

          <div className="grid grid-cols-7 gap-2">
            {DAYS_OF_WEEK.map((day) => {
              const isActive = scheduledDays.includes(day.value);
              return (
                <div
                  key={day.value}
                  className={`text-center p-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/50"
                      : "bg-muted/30 text-muted-foreground"
                  }`}
                >
                  <p className="font-body text-xs font-bold">{day.label}</p>
                  {isActive && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-1">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mx-auto">
                        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" fill="currentColor" fillOpacity="0.2" />
                      </svg>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {scheduledDays.length === 0 && (
            <p className="font-body text-sm text-muted-foreground text-center mt-4">
              Dispečer još nije dodelio radne dane.
            </p>
          )}
        </div>

        {/* Generate Route Button */}
        <motion.button
          onClick={handleGenerateRoute}
          disabled={generating}
          whileTap={{ scale: 0.97 }}
          className="w-full py-5 bg-secondary text-secondary-foreground font-body font-bold text-lg rounded-2xl hover:scale-[1.02] transition-transform shadow-xl disabled:opacity-70 mb-8"
        >
          {generating ? "Generisanje..." : "Generiši Današnju Rutu 🗺️"}
        </motion.button>

        {/* Loading Animation */}
        <AnimatePresence>
          {generating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 rounded-2xl bg-card border-2 border-primary/20 text-center mb-8"
            >
              {/* Animated truck on road */}
              <div className="relative h-24 mb-4 overflow-hidden">
                <svg width="100%" height="80" viewBox="0 0 300 80" fill="none" className="absolute bottom-0">
                  <path d="M0 60 Q75 30 150 60 Q225 90 300 60" stroke="hsl(45, 90%, 63%)" strokeWidth="3" strokeDasharray="8 6" fill="none" />
                </svg>
                <motion.div
                  animate={{ x: [0, 260] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-4 text-3xl"
                >
                  🚛
                </motion.div>
              </div>
              <p className="font-handwritten text-xl text-primary">Ruta se optimizuje uz pomoć AI modela...</p>
              <motion.div
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="h-1.5 bg-primary rounded-full mt-4"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Route Generated Success */}
        <AnimatePresence>
          {routeGenerated && !generating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-secondary/10 border-2 border-secondary/30 text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="mx-auto mb-4">
                  <circle cx="30" cy="30" r="26" stroke="hsl(120, 25%, 30%)" strokeWidth="3" strokeDasharray="6 4" fill="hsl(120, 25%, 30%)" fillOpacity="0.1" />
                  <path d="M18 30 L26 38 L42 22" stroke="hsl(120, 25%, 30%)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </motion.div>
              <h3 className="font-display text-xl font-bold text-foreground">Ruta je spremna!</h3>
              <p className="font-handwritten text-lg text-secondary mt-2">AI optimizacija završena</p>
              <p className="font-body text-sm text-muted-foreground mt-4">
                Funkcionalnost će uskoro biti dostupna sa pravim podacima o dostavi.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DriverDashboard;
