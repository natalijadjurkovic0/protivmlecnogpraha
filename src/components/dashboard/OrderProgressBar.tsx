import { motion } from "framer-motion";

interface OrderProgressBarProps {
  status: string; // raw status from orders.status
}

const STEPS = [
  { key: "confirmed", label: "Potvrđeno", emoji: "✅" },
  { key: "assigned", label: "Dodeljeno", emoji: "👷" },
  { key: "picked_up", label: "Preuzeto", emoji: "📦" },
  { key: "on_the_way", label: "Na putu", emoji: "🚛" },
  { key: "delivered", label: "Isporučeno", emoji: "🏡" },
];

// Map raw DB statuses → step index
const statusToStepIndex = (status: string): number => {
  const s = status.toLowerCase();
  if (["scheduled", "confirmed", "pending"].includes(s)) return 0;
  if (["assigned"].includes(s)) return 1;
  if (["picked_up", "pickedup"].includes(s)) return 2;
  if (["on_the_way", "out_for_delivery", "in_transit"].includes(s)) return 3;
  if (["delivered", "completed"].includes(s)) return 4;
  if (["cancelled", "canceled"].includes(s)) return -1;
  return 0;
};

const OrderProgressBar = ({ status }: OrderProgressBarProps) => {
  const currentStep = statusToStepIndex(status);
  const isCancelled = currentStep === -1;

  if (isCancelled) {
    return (
      <div className="p-4 rounded-xl bg-destructive/10 border-2 border-destructive/30">
        <p className="font-handwritten text-lg text-destructive">Porudžbina je otkazana ✕</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-card border-2 border-border">
      <p className="font-handwritten text-lg text-primary mb-4">~ status sledeće dostave ~</p>

      <div className="relative">
        {/* Progress line background */}
        <div className="absolute top-5 left-5 right-5 h-1 bg-muted rounded-full" />
        {/* Progress line filled */}
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `calc(${(currentStep / (STEPS.length - 1)) * 100}% - ${(currentStep / (STEPS.length - 1)) * 40}px)`,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-5 left-5 h-1 bg-primary rounded-full"
        />

        <div className="relative flex justify-between">
          {STEPS.map((step, i) => {
            const isComplete = i < currentStep;
            const isCurrent = i === currentStep;
            return (
              <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold border-2 transition-colors ${
                    isComplete
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary/20 border-primary text-primary shadow-md"
                      : "bg-muted border-border text-muted-foreground"
                  }`}
                >
                  {isComplete ? "✓" : step.emoji}
                </motion.div>
                <p
                  className={`font-body text-[10px] sm:text-xs text-center leading-tight ${
                    isCurrent
                      ? "font-bold text-foreground"
                      : isComplete
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderProgressBar;
