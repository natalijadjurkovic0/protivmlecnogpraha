import { motion } from "framer-motion";

export interface TimeWindow {
  id: string;
  label: string;
  emoji: string;
  start: string; // "HH:MM" 24h
  end: string;
}

export const TIME_WINDOWS: TimeWindow[] = [
  { id: "morning", label: "Ujutru", emoji: "🌅", start: "07:00", end: "11:00" },
  { id: "midday", label: "Sredinom dana", emoji: "☀️", start: "11:00", end: "15:00" },
  { id: "afternoon", label: "Popodne", emoji: "🌤️", start: "15:00", end: "19:00" },
  { id: "evening", label: "Uveče", emoji: "🌙", start: "19:00", end: "22:00" },
];

export const findWindowByTimes = (start?: string | null, end?: string | null): TimeWindow | null => {
  if (!start || !end) return null;
  // normalize "HH:MM:SS" → "HH:MM"
  const s = start.slice(0, 5);
  const e = end.slice(0, 5);
  return TIME_WINDOWS.find((w) => w.start === s && w.end === e) || null;
};

interface TimeWindowSelectorProps {
  value: string | null; // window id
  onChange: (windowId: string) => void;
  labelClassName?: string;
}

const TimeWindowSelector = ({ value, onChange, labelClassName }: TimeWindowSelectorProps) => {
  return (
    <div>
      <label className={labelClassName || "font-body text-sm font-semibold text-foreground block mb-1"}>
        🕒 Vreme kada mi odgovara isporuka *
      </label>
      <p className="font-handwritten text-primary text-sm mb-3">~ izaberi kad ti najbolje pasuje ~</p>
      <div className="grid grid-cols-2 gap-2">
        {TIME_WINDOWS.map((w, i) => {
          const isSelected = value === w.id;
          return (
            <motion.button
              key={w.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onChange(w.id)}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-md scale-[1.02]"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <span className="text-xl">{w.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-foreground leading-tight">{w.label}</p>
                <p className="font-body text-xs text-muted-foreground">
                  {w.start} – {w.end}
                </p>
              </div>
              {isSelected && <span className="text-primary font-bold">✓</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeWindowSelector;
