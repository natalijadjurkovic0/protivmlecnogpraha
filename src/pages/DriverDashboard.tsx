import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const AI_ROUTE_URL = "https://cresyl-malisa-pseudoambidextrously.ngrok-free.dev/api/generate-route";

const DAYS_OF_WEEK = [
  { label: "Pon", full: "Ponedeljak", value: "monday" },
  { label: "Uto", full: "Utorak", value: "tuesday" },
  { label: "Sre", full: "Sreda", value: "wednesday" },
  { label: "Čet", full: "Četvrtak", value: "thursday" },
  { label: "Pet", full: "Petak", value: "friday" },
  { label: "Sub", full: "Subota", value: "saturday" },
  { label: "Ned", full: "Nedelja", value: "sunday" },
];

interface RouteStop {
  type: string;
  name: string;
  address: string;
  liters: number;
  time: string;
}

const DriverDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scheduledDays, setScheduledDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [route, setRoute] = useState<RouteStop[]>([]);
  const [completedStops, setCompletedStops] = useState<Set<number>>(new Set());

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

  const handleGenerateRoute = async () => {
    if (!user) return;
    setGenerating(true);
    setRoute([]);
    setCompletedStops(new Set());

    try {
      // Fetch supplies (approved partner applications)
      const { data: supplies, error: supErr } = await supabase
        .from("partner_applications")
        .select("*")
        .eq("status", "approved");

      if (supErr) console.error("Supplies fetch error:", supErr);

      // Fetch active orders/subscriptions
      const { data: orders, error: ordErr } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("status", "active");

      if (ordErr) console.error("Orders fetch error:", ordErr);

      const payload = {
        driver_id: user.id,
        supplies: (supplies || []).map((s) => ({
          id: s.id,
          name: s.full_name,
          address: s.address,
          capacity: s.capacity_liters_per_day,
        })),
        orders: (orders || []).map((o) => ({
          id: o.id,
          user_id: o.user_id,
          plan_type: o.plan_type,
          weekly_liters: o.weekly_liters,
          delivery_days: o.delivery_days,
        })),
      };

      console.log("Sending route payload:", payload);

      const res = await fetch(AI_ROUTE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      console.log("Route response:", data);

      if (data.status === "success" && Array.isArray(data.route)) {
        setRoute(data.route);
        toast({ title: "Ruta generisana! 🗺️", description: `${data.route.length} stanica na današnjoj ruti.` });
      } else {
        throw new Error(data.message || "Nepoznat odgovor servera");
      }
    } catch (err: any) {
      console.error("Route generation failed:", err);
      toast({ title: "Greška", description: err.message || "Nije moguće generisati rutu.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const toggleStopComplete = (index: number) => {
    setCompletedStops((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
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

  const isPickup = (type: string) => type?.toLowerCase().includes("pickup") || type?.toLowerCase().includes("farmer") || type?.toLowerCase().includes("preuzimanje");

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
              <div className="relative h-24 mb-4 overflow-hidden">
                {/* Winding road */}
                <svg width="100%" height="80" viewBox="0 0 300 80" fill="none" className="absolute bottom-0">
                  <path d="M0 60 Q75 30 150 60 Q225 90 300 60" stroke="hsl(45, 90%, 63%)" strokeWidth="3" strokeDasharray="8 6" fill="none" />
                </svg>
                {/* Animated truck */}
                <motion.div
                  animate={{ x: [0, 260] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-4 text-3xl"
                >
                  🚛
                </motion.div>
                {/* Spinning milk bottle */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 right-4 text-2xl"
                >
                  🥛
                </motion.div>
              </div>
              <p className="font-handwritten text-xl text-primary">AI optimizuje tvoju rutu...</p>
              <p className="font-body text-xs text-muted-foreground mt-1">Prikupljam podatke o farmerima i narudžbinama</p>
              <motion.div
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 8, ease: "easeInOut" }}
                className="h-1.5 bg-primary rounded-full mt-4"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Route Timeline */}
        <AnimatePresence>
          {route.length > 0 && !generating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Route header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" className="mx-auto mb-2">
                    <circle cx="25" cy="25" r="22" stroke="hsl(120, 25%, 30%)" strokeWidth="2.5" strokeDasharray="6 4" fill="hsl(120, 25%, 30%)" fillOpacity="0.1" />
                    <path d="M15 25 L22 32 L35 19" stroke="hsl(120, 25%, 30%)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </motion.div>
                <h3 className="font-display text-xl font-bold text-foreground">Ruta je spremna!</h3>
                <p className="font-handwritten text-lg text-primary">~ {route.length} stanica danas ~</p>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  {completedStops.size}/{route.length} završeno
                </p>
              </div>

              {/* Vertical timeline */}
              <div className="relative pl-8">
                {/* Winding road line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5">
                  <svg width="6" height="100%" className="absolute left-[-2px]" preserveAspectRatio="none">
                    <line x1="3" y1="0" x2="3" y2="100%" stroke="hsl(45, 90%, 63%)" strokeWidth="3" strokeDasharray="8 6" />
                  </svg>
                </div>

                {route.map((stop, i) => {
                  const pickup = isPickup(stop.type);
                  const completed = completedStops.has(i);

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.12 }}
                      className="relative mb-6 last:mb-0"
                    >
                      {/* Timeline dot */}
                      <div className="absolute -left-5 top-4">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                          <circle
                            cx="11" cy="11" r="9"
                            stroke={pickup ? "hsl(120, 40%, 45%)" : "hsl(200, 70%, 50%)"}
                            strokeWidth="2.5"
                            strokeDasharray="4 3"
                            fill={completed ? (pickup ? "hsl(120, 40%, 45%)" : "hsl(200, 70%, 50%)") : "hsl(var(--background))"}
                            fillOpacity={completed ? 0.3 : 1}
                          />
                          {completed && (
                            <path d="M7 11 L10 14 L15 8" stroke={pickup ? "hsl(120, 40%, 45%)" : "hsl(200, 70%, 50%)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          )}
                        </svg>
                      </div>

                      {/* Stop card */}
                      <div
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          completed
                            ? "opacity-60 border-muted bg-muted/20"
                            : pickup
                            ? "border-[hsl(120,40%,45%)]/40 bg-[hsl(120,40%,45%)]/5"
                            : "border-[hsl(200,70%,50%)]/40 bg-[hsl(200,70%,50%)]/5"
                        }`}
                      >
                        {/* Type badge + time */}
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-body text-xs font-bold border ${
                              pickup
                                ? "border-[hsl(120,40%,45%)]/50 text-[hsl(120,40%,45%)]"
                                : "border-[hsl(200,70%,50%)]/50 text-[hsl(200,70%,50%)]"
                            }`}
                          >
                            {pickup ? "🌾 Preuzimanje" : "🏠 Dostava"}
                          </span>
                          <span className="font-body text-sm font-bold text-foreground">{stop.time}</span>
                        </div>

                        {/* Name */}
                        <h4 className={`font-display text-base font-bold text-foreground ${completed ? "line-through decoration-2 decoration-primary" : ""}`}>
                          {stop.name}
                        </h4>

                        {/* Address */}
                        <p className="font-body text-xs text-muted-foreground mt-0.5">{stop.address}</p>

                        {/* Liters + action */}
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-handwritten text-lg text-primary">
                            {stop.liters}L 🥛
                          </span>
                          <button
                            onClick={() => toggleStopComplete(i)}
                            className={`px-3 py-1.5 rounded-xl font-body text-xs font-bold border-2 transition-all ${
                              completed
                                ? "border-muted text-muted-foreground bg-muted/30 hover:bg-muted/50"
                                : "border-secondary/50 text-secondary bg-secondary/10 hover:bg-secondary/20"
                            }`}
                          >
                            {completed ? "↩ Vrati" : "✓ Završeno"}
                          </button>
                        </div>

                        {/* Google Maps link */}
                        {!completed && stop.address && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 font-body text-xs text-primary hover:underline"
                          >
                            📍 Otvori u Google Maps
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* All done celebration */}
              {completedStops.size === route.length && route.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-6 rounded-2xl bg-secondary/10 border-2 border-secondary/30 text-center"
                >
                  <motion.p
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                    className="text-4xl mb-2"
                  >
                    🎉
                  </motion.p>
                  <h3 className="font-display text-xl font-bold text-foreground">Sve isporuke završene!</h3>
                  <p className="font-handwritten text-lg text-secondary mt-1">Odlično obavljen posao 🚛✨</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DriverDashboard;
