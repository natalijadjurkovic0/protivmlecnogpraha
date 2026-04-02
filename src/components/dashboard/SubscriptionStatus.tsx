import { motion } from "framer-motion";
import { DAY_LABELS_SR } from "@/lib/dateHelpers";

interface SubscriptionStatusProps {
  status: "active" | "paused" | "cancelled";
  planName: string;
  deliveryDays: string[];
  onPause: () => void;
  onResume: () => void;
  loading: boolean;
}

const GoneFishingDoodle = () => (
  <motion.svg
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="absolute inset-0 w-full h-full pointer-events-none z-10"
    viewBox="0 0 300 200"
    fill="none"
  >
    <line x1="40" y1="30" x2="260" y2="170" stroke="hsl(0, 70%, 55%)" strokeWidth="4" strokeLinecap="round" />
    <line x1="260" y1="30" x2="40" y2="170" stroke="hsl(0, 70%, 55%)" strokeWidth="4" strokeLinecap="round" />
    <text
      x="150"
      y="105"
      textAnchor="middle"
      fontFamily="Caveat, cursive"
      fontSize="24"
      fill="hsl(0, 70%, 55%)"
      transform="rotate(-12 150 105)"
    >
      Pauzirano! 🎣
    </text>
  </motion.svg>
);

const SubscriptionStatus = ({
  status,
  planName,
  deliveryDays,
  onPause,
  onResume,
  loading,
}: SubscriptionStatusProps) => {
  return (
    <div className="relative">
      <h2 className="font-display text-2xl font-black text-foreground mb-4">Tvoja pretplata</h2>

      <div
        className={`relative p-6 rounded-2xl border-2 transition-all ${
          status === "paused" ? "border-destructive/40 bg-destructive/5" : "border-primary/30 bg-primary/5"
        }`}
      >
        {status === "paused" && <GoneFishingDoodle />}

        <div className={status === "paused" ? "opacity-40" : ""}>
          <h3 className="font-display text-xl font-bold text-foreground">{planName}</h3>

          <div className="mt-4">
            <p className="font-handwritten text-primary text-lg mb-2">Dani dostave:</p>
            <div className="flex gap-2">
              {deliveryDays.map((day) => (
                <span
                  key={day}
                  className="px-4 py-2 rounded-lg bg-primary/10 text-foreground font-body text-sm font-medium"
                >
                  {dayLabels[day] || day}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="font-body text-sm text-muted-foreground">Status:</span>
            <span
              className={`px-3 py-1 rounded-full font-body text-xs font-bold ${
                status === "active"
                  ? "bg-secondary text-secondary-foreground"
                  : status === "paused"
                  ? "bg-destructive/20 text-destructive"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {status === "active" ? "Aktivna ✅" : status === "paused" ? "Pauzirana ⏸️" : "Otkazana"}
            </span>
          </div>
        </div>

        <div className="mt-6 relative z-20">
          {status === "active" ? (
            <button
              onClick={onPause}
              disabled={loading}
              className="px-6 py-3 border-2 border-destructive text-destructive font-body font-bold text-sm rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-all disabled:opacity-50"
            >
              {loading ? "..." : "Pauziraj pretplatu ⏸️"}
            </button>
          ) : status === "paused" ? (
            <button
              onClick={onResume}
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground font-body font-bold text-sm rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading ? "..." : "Nastavi pretplatu ▶️"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;
