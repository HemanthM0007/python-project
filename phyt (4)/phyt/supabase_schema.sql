-- =======================================================
-- INFRA SENSE AI - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Copy and paste this script into your Supabase SQL Editor
-- to set up all required tables, triggers, and seed data.
-- =======================================================

-- 1. Create Profiles Table (extends Supabase Auth Users)
create table if open public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  phone_number text,
  company_name text,
  role text default 'user', -- 'user' or 'admin'
  sector text default '',
  address text,
  photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "Allow profiles reading by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Allow profile updates by own user"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- 2. Create Metrics Table (Sector Telemetry and History)
create table if open public.metrics (
  sector text primary key,
  total_devices integer default 0,
  active_systems integer default 0,
  ai_risk_score integer default 0,
  energy_consumption integer default 0,
  detected_anomalies integer default 0,
  system_health integer default 0,
  temperature numeric default 0,
  voltage numeric default 0,
  chart_data jsonb, -- JSON array of historical logs
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.metrics enable row level security;

create policy "Allow telemetry select for authenticated users"
  on public.metrics for select
  to authenticated
  using (true);

create policy "Allow telemetry update for authenticated users"
  on public.metrics for update
  to authenticated
  using (true);

-- 3. Create Alerts Table (Central HUD Log)
create table if open public.alerts (
  id uuid default gen_random_uuid() primary key,
  id_code text not null,
  sector text not null,
  system text not null,
  message text not null,
  type text default 'warning', -- 'critical', 'warning', 'success'
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'active', -- 'active', 'acknowledged'
  user_id uuid references auth.users(id) on delete set null
);

alter table public.alerts enable row level security;

create policy "Allow alerts select for authenticated users"
  on public.alerts for select
  to authenticated
  using (true);

create policy "Allow alerts insert for authenticated users"
  on public.alerts for insert
  to authenticated
  with check (true);

create policy "Allow alerts update for authenticated users"
  on public.alerts for update
  to authenticated
  using (true);

create policy "Allow alerts delete for admins"
  on public.alerts for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- =======================================================
-- 4. Automatic Profile Provisioning Trigger
-- =======================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, phone_number, company_name, role, sector, address, photo_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'displayName', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'phoneNumber', ''),
    coalesce(new.raw_user_meta_data->>'companyName', 'Enter Company Name'),
    coalesce(new.raw_user_meta_data->>'role', 'user'),
    coalesce(new.raw_user_meta_data->>'sector', ''),
    coalesce(new.raw_user_meta_data->>'address', ''),
    coalesce(new.raw_user_meta_data->>'photoURL', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || new.id)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution binding
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =======================================================
-- 5. Seed Telemetry & Chart Data
-- =======================================================
insert into public.metrics (sector, total_devices, active_systems, ai_risk_score, energy_consumption, detected_anomalies, system_health, temperature, voltage, chart_data)
values 
('Industrial Sector', 148, 142, 34, 924, 3, 96, 68.5, 415.2, 
 '[
    {"name": "Mon", "risk": 25, "energy": 890, "health": 98, "voltage": 412.5, "anomalies": 1, "temperature": 65},
    {"name": "Tue", "risk": 32, "energy": 940, "health": 95, "voltage": 414.8, "anomalies": 2, "temperature": 68},
    {"name": "Wed", "risk": 20, "energy": 910, "health": 97, "voltage": 416.1, "anomalies": 0, "temperature": 63},
    {"name": "Thu", "risk": 58, "energy": 965, "health": 91, "voltage": 410.2, "anomalies": 5, "temperature": 78},
    {"name": "Fri", "risk": 42, "energy": 930, "health": 94, "voltage": 413.6, "anomalies": 3, "temperature": 70},
    {"name": "Sat", "risk": 28, "energy": 880, "health": 96, "voltage": 415.4, "anomalies": 1, "temperature": 66},
    {"name": "Sun", "risk": 34, "energy": 924, "health": 96, "voltage": 415.2, "anomalies": 3, "temperature": 68}
  ]'),
('Institutional Sector', 320, 312, 12, 248, 0, 99, 22.4, 230.1, 
 '[
    {"name": "Mon", "risk": 10, "energy": 240, "health": 99, "voltage": 230.5, "anomalies": 0, "temperature": 22},
    {"name": "Tue", "risk": 15, "energy": 255, "health": 98, "voltage": 229.8, "anomalies": 0, "temperature": 23},
    {"name": "Wed", "risk": 11, "energy": 235, "health": 99, "voltage": 230.2, "anomalies": 0, "temperature": 21},
    {"name": "Thu", "risk": 14, "energy": 260, "health": 99, "voltage": 231.1, "anomalies": 0, "temperature": 23},
    {"name": "Fri", "risk": 12, "energy": 250, "health": 99, "voltage": 230.6, "anomalies": 0, "temperature": 22},
    {"name": "Sat", "risk": 8, "energy": 210, "health": 100, "voltage": 230.4, "anomalies": 0, "temperature": 21},
    {"name": "Sun", "risk": 12, "energy": 248, "health": 99, "voltage": 230.1, "anomalies": 0, "temperature": 22}
  ]'),
('Hospital Sector', 1890, 1854, 28, 512, 1, 94, 19.8, 228.4, 
 '[
    {"name": "Mon", "risk": 20, "energy": 490, "health": 95, "voltage": 229.1, "anomalies": 1, "temperature": 18},
    {"name": "Tue", "risk": 25, "energy": 530, "health": 94, "voltage": 228.5, "anomalies": 2, "temperature": 20},
    {"name": "Wed", "risk": 18, "energy": 505, "health": 96, "voltage": 229.0, "anomalies": 0, "temperature": 19},
    {"name": "Thu", "risk": 35, "energy": 540, "health": 92, "voltage": 227.4, "anomalies": 3, "temperature": 22},
    {"name": "Fri", "risk": 30, "energy": 520, "health": 93, "voltage": 228.1, "anomalies": 2, "temperature": 21},
    {"name": "Sat", "risk": 22, "energy": 485, "health": 95, "voltage": 228.6, "anomalies": 1, "temperature": 18},
    {"name": "Sun", "risk": 28, "energy": 512, "health": 94, "voltage": 228.4, "anomalies": 1, "temperature": 20}
  ]'),
('Residential Sector', 450, 446, 18, 1480, 1, 98, 42.1, 480.6, 
 '[
    {"name": "Mon", "risk": 15, "energy": 1420, "health": 98, "voltage": 481.5, "anomalies": 1, "temperature": 39},
    {"name": "Tue", "risk": 22, "energy": 1490, "health": 97, "voltage": 479.2, "anomalies": 2, "temperature": 43},
    {"name": "Wed", "risk": 14, "energy": 1460, "health": 99, "voltage": 480.4, "anomalies": 0, "temperature": 41},
    {"name": "Thu", "risk": 30, "energy": 1510, "health": 95, "voltage": 478.1, "anomalies": 3, "temperature": 46},
    {"name": "Fri", "risk": 25, "energy": 1475, "health": 96, "voltage": 479.9, "anomalies": 2, "temperature": 44},
    {"name": "Sat", "risk": 12, "energy": 1390, "health": 99, "voltage": 480.8, "anomalies": 0, "temperature": 40},
    {"name": "Sun", "risk": 18, "energy": 1480, "health": 98, "voltage": 480.6, "anomalies": 1, "temperature": 42}
  ]')
on conflict (sector) do update set
  total_devices = excluded.total_devices,
  active_systems = excluded.active_systems,
  ai_risk_score = excluded.ai_risk_score,
  energy_consumption = excluded.energy_consumption,
  detected_anomalies = excluded.detected_anomalies,
  system_health = excluded.system_health,
  temperature = excluded.temperature,
  voltage = excluded.voltage,
  chart_data = excluded.chart_data;

-- Seed initial alerts
insert into public.alerts (id_code, sector, system, message, type, timestamp, status)
values
('ALT-8092', 'Industrial Sector', 'Cooling Compressor 3B', 'Primary motor temperature exceeded threshold (82.4°C / 75°C)', 'critical', now() - interval '15 minutes', 'active'),
('ALT-4211', 'Residential Sector', 'Solar Inverter Array 4', 'Voltage spike detected in Phase B (254V). Auto-throttling active.', 'warning', now() - interval '45 minutes', 'active'),
('ALT-7119', 'Hospital Sector', 'Main Aqueduct Valve #12', 'Pressure drops below 2.1 Bar. AI predicted pipeline seal wear.', 'warning', now() - interval '2 hours', 'acknowledged');
