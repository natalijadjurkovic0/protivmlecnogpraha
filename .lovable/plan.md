

## Plan: Uključivanje adresa kupaca u generisanje rute

### Problem
Kada vozač generiše rutu, backendu se šalju podaci o pretplatama (subscriptions) ali **bez adresa kupaca**. Adrese se nalaze u `profiles` tabeli, a trenutni kod ih ne povlači. Zato AI backend nema informaciju gde treba dostaviti mleko.

Takođe, `orders` tabela je prazna jer nijedan kupac još nije koristio jednokratnu narudžbinu — to je normalno. Dispečer panel prikazuje podatke iz `subscriptions` tabele (ne iz `orders`).

### Rešenje

#### Izmena: `src/pages/DriverDashboard.tsx`

U `handleGenerateRoute` funkciji, nakon što se povuku pretplate i single orders, dodati:

1. **Fetch profila kupaca** — za svaki `user_id` iz pretplata i single orders, povući adresu iz `profiles` tabele
2. **Obogatiti payload** — svakoj pretplati i narudžbini dodati `delivery_address` iz profila (ili iz `orders.delivery_address` za single orders koji je već imaju)

Konkretno:
- Nakon fetch-a `subs` i `singleOrders`, prikupiti sve jedinstvene `user_id` vrednosti
- Fetch `profiles` za te `user_id` vrednosti: `supabase.from("profiles").select("user_id, address, display_name, phone").in("user_id", userIds)`
- Mapirati adrese u payload za subscriptions: dodati `delivery_address` i `customer_name` polja
- Single orders već imaju `delivery_address` kolonu, ali dodati i `customer_name` iz profila

#### RLS — vozač mora moći da čita profile kupaca

Trenutno `profiles` tabela ima SELECT politiku samo za sopstveni profil i za dispečere. Vozač ne može da čita tuđe profile.

**Nova RLS politika**: Dozvoliti vozačima da čitaju sve profile (potrebno za adrese dostave):
```sql
CREATE POLICY "Drivers can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'vozac'::app_role));
```

### Fajlovi za izmenu
- **Nova migracija**: RLS politika za vozače na `profiles` tabeli
- **`src/pages/DriverDashboard.tsx`**: fetch profila i obogaćivanje payload-a sa adresama

