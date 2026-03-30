import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Greška", description: error.message, variant: "destructive" });
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        toast({ title: "Greška", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Uspeh!", description: "Proverite email za potvrdu." });
      }
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-3xl p-8 md:p-10 bg-foreground/90">
            <div className="text-center mb-8">
              <span className="font-handwritten text-2xl text-primary">
                {isLogin ? "Dobrodošli nazad" : "Pridruži se"}
              </span>
              <h1 className="font-display text-3xl font-black text-warm-white mt-2">
                {isLogin ? "Prijavi se" : "Napravi nalog"}
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="font-handwritten text-lg text-primary block mb-1">Ime</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Vaše ime"
                    className="w-full px-4 py-3 rounded-xl bg-warm-white/10 border border-warm-white/20 text-warm-white placeholder:text-warm-white/40 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              )}

              <div>
                <label className="font-handwritten text-lg text-primary block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vas@email.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-warm-white/10 border border-warm-white/20 text-warm-white placeholder:text-warm-white/40 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="font-handwritten text-lg text-primary block mb-1">Lozinka</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-warm-white/10 border border-warm-white/20 text-warm-white placeholder:text-warm-white/40 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-primary-foreground font-body font-bold text-lg rounded-xl hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50"
              >
                {loading ? "Sačekajte..." : isLogin ? "Prijavi se 🐄" : "Registruj se 🐄"}
              </button>
            </form>

            <p className="text-center mt-6 font-body text-warm-white/60 text-sm">
              {isLogin ? "Nemate nalog?" : "Već imate nalog?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? "Registrujte se" : "Prijavite se"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
