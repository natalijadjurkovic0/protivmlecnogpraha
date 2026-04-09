interface AddressFieldsProps {
  street: string;
  number: string;
  city: string;
  postalCode: string;
  onChange: (field: "street" | "number" | "city" | "postalCode", value: string) => void;
  inputClassName?: string;
  labelClassName?: string;
  layout?: "default" | "partner";
}

export const combineAddress = (street: string, number: string, city: string, postalCode: string) => {
  const parts = [`${street.trim()} ${number.trim()}`.trim(), city.trim()];
  if (postalCode.trim()) parts.push(postalCode.trim());
  return parts.filter(Boolean).join(", ");
};

export const parseAddress = (address: string) => {
  if (!address) return { street: "", number: "", city: "Beograd", postalCode: "" };
  const parts = address.split(",").map((s) => s.trim());
  const streetPart = parts[0] || "";
  const match = streetPart.match(/^(.+?)\s+(\d+\S*)$/);
  return {
    street: match ? match[1] : streetPart,
    number: match ? match[2] : "",
    city: parts[1] || "Beograd",
    postalCode: parts[2] || "",
  };
};

const AddressFields = ({
  street,
  number,
  city,
  postalCode,
  onChange,
  inputClassName = "w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-body text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all",
  labelClassName = "font-body text-sm font-semibold text-foreground block mb-1",
  layout = "default",
}: AddressFieldsProps) => {
  if (layout === "partner") {
    const cls = inputClassName;
    const lbl = labelClassName;
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className={lbl}>Ulica</label>
            <input value={street} onChange={(e) => onChange("street", e.target.value)} placeholder="Gramsijeva" className={cls} />
          </div>
          <div>
            <label className={lbl}>Broj</label>
            <input value={number} onChange={(e) => onChange("number", e.target.value)} placeholder="2" className={cls} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Grad</label>
            <input value={city} onChange={(e) => onChange("city", e.target.value)} placeholder="Beograd" className={cls} />
          </div>
          <div>
            <label className={lbl}>Poštanski broj</label>
            <input value={postalCode} onChange={(e) => onChange("postalCode", e.target.value)} placeholder="11000" className={cls} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className={labelClassName}>📍 Ulica *</label>
          <input value={street} onChange={(e) => onChange("street", e.target.value)} placeholder="Gramsijeva" className={inputClassName} />
        </div>
        <div>
          <label className={labelClassName}>Broj *</label>
          <input value={number} onChange={(e) => onChange("number", e.target.value)} placeholder="2" className={inputClassName} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClassName}>Grad *</label>
          <input value={city} onChange={(e) => onChange("city", e.target.value)} placeholder="Beograd" className={inputClassName} />
        </div>
        <div>
          <label className={labelClassName}>Poštanski broj</label>
          <input value={postalCode} onChange={(e) => onChange("postalCode", e.target.value)} placeholder="11000" className={inputClassName} />
        </div>
      </div>
    </div>
  );
};

export default AddressFields;
