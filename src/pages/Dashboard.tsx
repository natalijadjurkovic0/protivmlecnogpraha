import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlanSelector, { plans, type Plan } from "@/components/dashboard/PlanSelector";
import SubscriptionStatus from "@/components/dashboard/SubscriptionStatus";
import AddOnsSidebar from "@/components/dashboard/AddOnsSidebar";
import type { Tables } from "@/integrations/supabase/types";

type Subscription = Tables<"subscriptions">;

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSubscription(data[0]);
        }
        setFetching(false);
      });
  }, [user]);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan.type);
    setSelectedDays([]);
  };

  const handleToggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleConfirmPlan = async () => {
    if (!user || !selectedPlan) return;
    const plan = plans.find((p) => p.type === selectedPlan);
    if (!plan) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: user.id,
        plan_type: plan.type,
        weekly_liters: plan.litersPerMonth / 4,
        delivery_days: plan.type === "probaj" ? ["single"] : selectedDays,
        price_rsd: plan.priceRsd,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Greška", description: error.message, variant: "destructive" });
    } else {
      setSubscription(data);
      toast({ title: "Uspeh! 🎉", description: `Plan "${plan.name}" je aktiviran.` });
    }
    setLoading(false);
  };

  const handlePause = async () => {
    if (!subscription) return;
    setLoading(true);
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "paused" })
      .eq("id", subscription.id);

    if (!error) {
      setSubscription({ ...subscription, status: "paused" });
      toast({ title: "Pauzirano ⏸️", description: "Pretplata je pauzirana." });
    }
    setLoading(false);
  };

  const handleResume = async () => {
    if (!subscription) return;
    setLoading(true);
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "active" })
      .eq("id", subscription.id);

    if (!error) {
      setSubscription({ ...subscription, status: "active" });
      toast({ title: "Aktivna! ▶️", description: "Pretplata je ponovo aktivna." });
    }
    setLoading(false);
  };

  if (authLoading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-handwritten text-2xl text-primary"
        >
          Učitavanje... 🐄
        </motion.p>
      </div>
    );
  }

  const activePlanDetails = subscription
    ? plans.find((p) => p.type === subscription.plan_type)
    : null;

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-handwritten text-xl text-primary">~ tvoj mlečni kutak ~</p>
            <h1 className="font-display text-3xl md:text-4xl font-black text-foreground">
              Dashboard
            </h1>
          </div>
          <button
            onClick={signOut}
            className="px-5 py-2 border-2 border-border text-muted-foreground font-body text-sm rounded-lg hover:bg-muted transition-colors"
          >
            Odjavi se
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {subscription && subscription.status !== "cancelled" ? (
              <SubscriptionStatus
                status={subscription.status}
                planName={activePlanDetails?.name || subscription.plan_type}
                deliveryDays={subscription.delivery_days}
                onPause={handlePause}
                onResume={handleResume}
                loading={loading}
              />
            ) : (
              <PlanSelector
                selectedPlan={selectedPlan}
                selectedDays={selectedDays}
                onSelectPlan={handleSelectPlan}
                onToggleDay={handleToggleDay}
                onConfirm={handleConfirmPlan}
                loading={loading}
              />
            )}
          </div>

          {/* Sidebar */}
          <div>
            <AddOnsSidebar />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
