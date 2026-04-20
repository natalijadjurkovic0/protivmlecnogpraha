import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AddressFields, { combineAddress, parseAddress } from "@/components/AddressFields";
import TimeWindowSelector, { TIME_WINDOWS } from "@/components/dashboard/TimeWindowSelector";

export interface CheckoutResult {
  address: string;
  phone: string;
  driverNote: string;
  timeWindowStart: string;
  timeWindowEnd: string;
  timeWindowId: string;
}

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: CheckoutResult) => void;
  loading: boolean;
  title?: string;
}

const CheckoutModal = ({ open, onClose, onConfirm, loading, title = "Dostava" }: CheckoutModalProps) => {
  const { user } = useAuth();
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("Beograd");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [driverNote, setDriverNote] = useState("");
  const [timeWindowId, setTimeWindowId] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (!open) {
      setPrefilled(false);
      setDriverNote("");
      setTimeWindowId(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !user || prefilled) return;
    supabase
      .from("profiles")
      .select("address, phone")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.address) {
          const parsed = parseAddress(data.address);
          setStreet(parsed.street);
          setNumber(parsed.number);
          setCity(parsed.city);
          setPostalCode(parsed.postalCode);
        }
        if (data?.phone) setPhone(data.phone);
        setPrefilled(true);
      });
  }, [open, user, prefilled]);

  const combinedAddress = combineAddress(street, number, city, postalCode);

  const handleSubmit = () => {
    if (!street.trim() || !number.trim() || !city.trim() || !phone.trim() || !timeWindowId) return;
    const win = TIME_WINDOWS.find((w) => w.id === timeWindowId);
    if (!win) return;
    onConfirm({
      address: combinedAddress,
      phone: phone.trim(),
      driverNote: driverNote.trim(),
      timeWindowStart: win.start,
      timeWindowEnd: win.end,
      timeWindowId: win.id,
    });
  };

  if (!open) return null;

  const inputCls = "w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all";
  const labelCls = "font-body text-sm font-semibold text-foreground block mb-1";

  const handleFieldChange = (field: "street" | "number" | "city" | "postalCode", value: string) => {
    if (field === "street") setStreet(value);
    else if (field === "number") setNumber(value);
    else if (field === "city") setCity(value);
    else setPostalCode(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-card border-2 border-primary/30 p-8 shadow-2xl"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='hsl(47,90%25,55%25)' stroke-width='3' stroke-dasharray='14%2C 8' stroke-dashoffset='0' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundSize: "100% 100%",
        }}
      >
        <svg className="absolute -top-4 -right-4 w-12 h-12" viewBox="0 0 48 48" fill="none">
          <path d="M24 4L28 18H42L30 26L34 40L24 32L14 40L18 26L6 18H20Z" fill="hsl(47, 90%, 55%)" stroke="hsl(0,0%,10%)" strokeWidth="2" strokeLinejoin="round" />
        </svg>

        <h3 className="font-display text-2xl font-black text-foreground mb-1">{title}</h3>
        <p className="font-handwritten text-primary text-lg mb-6">~ gde da ti donesemo mleko? ~</p>

        <div className="space-y-4">
          <AddressFields
            street={street}
            number={number}
            city={city}
            postalCode={postalCode}
            onChange={handleFieldChange}
            inputClassName={inputCls}
            labelClassName={labelCls}
          />

          <div>
            <label className={labelCls}>📞 Broj Telefona *</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+381 6X XXX XXXX"
              className={inputCls}
            />
          </div>

          <TimeWindowSelector
            value={timeWindowId}
            onChange={setTimeWindowId}
            labelClassName={labelCls}
          />
            <textarea
              value={driverNote}
              onChange={(e) => setDriverNote(e.target.value)}
              placeholder="Treći sprat, zvonce desno..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-border text-muted-foreground font-body font-bold text-sm rounded-xl hover:bg-muted transition-colors"
          >
            Otkaži
          </button>
          <button
            onClick={handleSubmit}
            disabled={!street.trim() || !number.trim() || !city.trim() || !phone.trim() || loading}
            className="flex-1 py-3 bg-foreground text-background font-body font-bold text-sm rounded-xl hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sačekaj..." : "Potvrdi ✓"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CheckoutModal;
