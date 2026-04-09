import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AddressFields, { combineAddress, parseAddress } from "@/components/AddressFields";

const ProfileAddressCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("Beograd");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
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
      });
  }, [user]);

  const combinedAddress = combineAddress(street, number, city, postalCode);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ address: combinedAddress, phone: phone.trim() })
      .eq("user_id", user.id);
    if (!error) {
      toast({ title: "Sačuvano! 📍", description: "Tvoja adresa je ažurirana." });
      setEditing(false);
    }
    setSaving(false);
  };

  const handleFieldChange = (field: "street" | "number" | "city" | "postalCode", value: string) => {
    if (field === "street") setStreet(value);
    else if (field === "number") setNumber(value);
    else if (field === "city") setCity(value);
    else setPostalCode(value);
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground font-body text-sm outline-none focus:border-primary";
  const labelCls = "font-body text-xs font-semibold text-muted-foreground block mb-0.5";

  return (
    <div className="p-6 rounded-2xl bg-card border-2 border-dashed border-primary/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg font-bold text-foreground">📍 Moja adresa</h3>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1 text-xs font-body font-bold text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
          >
            Ažuriraj
          </button>
        )}
      </div>

      {editing ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <AddressFields
            street={street}
            number={number}
            city={city}
            postalCode={postalCode}
            onChange={handleFieldChange}
            inputClassName={inputCls}
            labelClassName={labelCls}
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Telefon"
            className={inputCls}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 text-xs font-body text-muted-foreground border border-border rounded-lg hover:bg-muted"
            >
              Otkaži
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-xs font-body font-bold text-primary-foreground bg-primary rounded-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {saving ? "..." : "Sačuvaj"}
            </button>
          </div>
        </motion.div>
      ) : (
        <div>
          <p className="font-body text-sm text-foreground">{combinedAddress || "Nije uneta adresa"}</p>
          {phone && <p className="font-body text-xs text-muted-foreground mt-1">📞 {phone}</p>}
        </div>
      )}
    </div>
  );
};

export default ProfileAddressCard;
