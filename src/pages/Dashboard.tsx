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
import { StarDoodle } from "@/components/DoodleOverlays";

type Subscription = Tables<"subscriptions">;
type Order = Tables<"orders">;

const dayLabels: Record<string, string> = {
  monday: "Pon",
  wednesday: "Sre",
  saturday: "Sub",
};

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1),
      supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("delivery_date", { ascending: false })
        .limit(10),
    ]).then(([subRes, ordRes]) => {
      if (subRes.data && subRes.data.length > 0) setSubscription(subRes.data[0]);
      if (ordRes.data) setOrders(ordRes.data);
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

  // Calculate next delivery (mock — next matching day from today)
  const getNextDeliveryDate = () => {
    if (!subscription || subscription.status !== "active") return null;
    const dayMap: Record<string, number> = { monday: 1, wednesday: 3, saturday: 6 };
    const today = new Date();
    const todayDay = today.getDay();
    const deliveryDays = subscription.delivery_days
      .map((d) => dayMap[d])
      .filter(Boolean)
      .sort((a, b) => a - b);
    if (deliveryDays.length === 0) return null;

    for (const d of deliveryDays) {
      const diff = d - todayDay;
      if (diff > 0) {
        const next = new Date(today);
        next.setDate(today.getDate() + diff);
        return next;
      }
    }
    const diff = 7 - todayDay + deliveryDays[0];
    const next = new Date(today);
    next.setDate(today.getDate() + diff);
    return next;
  };

  const nextDelivery = getNextDeliveryDate();
  const daysUntilDelivery = nextDelivery
    ? Math.ceil((nextDelivery.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
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
              Kupac Dashboard
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
          <div className="lg:col-span-2 space-y-8">
            {subscription && subscription.status !== "cancelled" ? (
              <>
                <SubscriptionStatus
                  status={subscription.status}
                  planName={activePlanDetails?.name || subscription.plan_type}
                  deliveryDays={subscription.delivery_days}
                  onPause={handlePause}
                  onResume={handleResume}
                  loading={loading}
                />

                {/* Next Delivery Card */}
                {nextDelivery && subscription.status === "active" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-primary/10 border-2 border-primary/20"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-handwritten text-lg text-primary">Sledeća dostava</p>
                        <p className="font-display text-2xl font-black text-foreground mt-1">
                          {nextDelivery.toLocaleDateString("sr-Latn-RS", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-display text-4xl font-black text-primary">
                          {daysUntilDelivery}
                        </p>
                        <p className="font-handwritten text-sm text-muted-foreground">
                          {daysUntilDelivery === 1 ? "dan" : "dana"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Subscription Tracker */}
                <div className="p-6 rounded-2xl bg-card border-2 border-border">
                  <h3 className="font-display text-xl font-bold text-foreground mb-4">
                    Tvoja pretplata — pregled
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-xl bg-muted">
                      <p className="font-display text-2xl font-black text-primary">
                        {activePlanDetails?.litersPerMonth || "—"}L
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-1">mesečno</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted">
                      <p className="font-display text-2xl font-black text-primary">
                        {subscription.weekly_liters}L
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-1">nedeljno</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted">
                      <p className="font-display text-2xl font-black text-primary">
                        {subscription.price_rsd.toLocaleString()}
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-1">RSD/mes</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {subscription.delivery_days.map((day) => (
                      <span
                        key={day}
                        className="px-3 py-1 rounded-full bg-primary/10 text-foreground font-body text-xs font-medium"
                      >
                        {dayLabels[day] || day}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Order History */}
                <div className="p-6 rounded-2xl bg-card border-2 border-border">
                  <h3 className="font-display text-xl font-bold text-foreground mb-4">
                    Istorija dostava
                  </h3>
                  {orders.length === 0 ? (
                    <p className="font-body text-muted-foreground text-sm">
                      Još nema dostava. Tvoja prva dostava je na putu! 🚛
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-handwritten text-xl text-primary">
                              {order.status === "delivered" ? "✓" : order.status === "scheduled" ? "📦" : "⏳"}
                            </span>
                            <div>
                              <p className="font-body text-sm font-semibold text-foreground">
                                {new Date(order.delivery_date).toLocaleDateString("sr-Latn-RS", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                              <p className="font-body text-xs text-muted-foreground capitalize">
                                {order.status}
                              </p>
                            </div>
                          </div>
                          {order.total_rsd && (
                            <span className="font-body text-sm font-bold text-foreground">
                              {order.total_rsd} RSD
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
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
          <div className="space-y-6">
            <AddOnsSidebar />
            <div className="p-6 rounded-2xl bg-card border-2 border-dashed border-primary/20 text-center">
              <StarDoodle className="mx-auto mb-2" />
              <p className="font-handwritten text-lg text-primary">Tip dana</p>
              <p className="font-body text-sm text-muted-foreground mt-1">
                Sveže mleko je najbolje ujutru uz topao hleb i med. Probaj! 🍯
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
