
CREATE TABLE public.delivery_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    driver_id UUID,
    subscription_id UUID,
    order_id UUID,
    exact_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'delivered',
    liters NUMERIC NOT NULL DEFAULT 0,
    type TEXT NOT NULL DEFAULT 'subscription_fulfillment',
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.delivery_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own delivery history"
ON public.delivery_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Drivers can insert delivery history"
ON public.delivery_history FOR INSERT
TO authenticated
WITH CHECK (
    has_role(auth.uid(), 'vozac'::app_role)
    OR has_role(auth.uid(), 'dispecer'::app_role)
);

CREATE POLICY "Dispatchers can view all delivery history"
ON public.delivery_history FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'dispecer'::app_role));

CREATE INDEX idx_delivery_history_user ON public.delivery_history(user_id);
CREATE INDEX idx_delivery_history_date ON public.delivery_history(exact_date);
