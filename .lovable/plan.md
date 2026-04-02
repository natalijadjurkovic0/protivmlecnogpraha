

## Plan: Čuvanje dnevne ponude mlekara u bazi

### Problem
Mlekar unosi količine mleka po danima na svom dashboardu, ali podaci se ne čuvaju — ostaju samo u memoriji i gube se pri osvežavanju.

### Rešenje

#### 1. Nova tabela `farmer_daily_offers`
Kreirati tabelu koja čuva koliko litara mlekar nudi svakog dana:

| Kolona | Tip | Opis |
|--------|-----|------|
| id | uuid | PK |
| user_id | uuid | Mlekarov ID |
| day_of_week | text | monday, tuesday, ... |
| liters | numeric | Količina litara |
| created_at | timestamptz | Datum kreiranja |
| updated_at | timestamptz | Datum ažuriranja |

Unique constraint na `(user_id, day_of_week)` — jedan red po danu po mlekaru.

#### 2. RLS politike
- Mlekar može da čita/upisuje/ažurira svoje redove (`auth.uid() = user_id`)
- Dispečer može da čita sve redove (za prikaz u detaljima farmera)

#### 3. Ažuriranje `MlekarDashboard.tsx`
- Pri učitavanju: fetch postojećih ponuda iz `farmer_daily_offers`
- `handleSave`: upsert (INSERT ... ON CONFLICT UPDATE) za svaki dan
- Podaci se prikazuju odmah pri otvaranju dashboarda

#### 4. Ažuriranje `DispatcherDashboard.tsx`
- U popup-u detalja farmera: fetch iz `farmer_daily_offers` gde je `user_id` = farmerov `user_id`
- Prikazati tabelu dan → litara

### Fajlovi za izmenu
- **Nova migracija**: kreiranje tabele `farmer_daily_offers` + RLS
- **`src/pages/MlekarDashboard.tsx`**: fetch + upsert logika
- **`src/pages/DispatcherDashboard.tsx`**: fetch ponuda u detaljima farmera

