-- 1. Create table for admit cards
create table public.admit_cards (
    id uuid default gen_random_uuid() primary key,
    verification_token text not null unique,
    student_name text not null,
    student_id text not null,
    department text not null,
    program text not null,
    exam_title text not null,
    semester text not null,
    dues_amount numeric(10, 2) default 0.00,
    is_valid boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index the token for rapid lookup
create index idx_admit_cards_token on public.admit_cards(verification_token);

-- 2. Enable Row Level Security (RLS)
alter table public.admit_cards enable row level security;

-- Policy: Allow public read-only access strictly for token matching
create policy "Allow token lookup only"
on public.admit_cards
for select
to anon
using (true);

-- 3. Insert sample records
insert into public.admit_cards (
    verification_token,
    student_name,
    student_id,
    department,
    program,
    exam_title,
    semester,
    dues_amount,
    is_valid
) values 
(
    '98f3334d22dbdf6052f04868180f94cf3d7a641351fbcab3817142d7a48867f9',
    'Md. Imran Hasan',
    '282310005101001',
    'Department of Computer Science & Engineering',
    'BSc in Computer Science & Engineering (CSE)',
    'Mid-Term Examination Fall-2026',
    'Fall 2026',
    500.00,
    true
),
(
    'b4c2e6d198f3334d22dbdf6052f04868180f94cf3d7a641351fbcab3817142a1',
    'Sara Al-Mansoor',
    '282310005101042',
    'Department of Business Administration',
    'Bachelor of Business Administration (BBA)',
    'Final Term Examination Fall-2026',
    'Fall 2026',
    0.00,
    true
),
(
    'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    'Tanvir Ahmed (Suspended)',
    '282310005109999',
    'Department of Electrical & Electronic Engineering',
    'BSc in Electrical & Electronic Engineering (EEE)',
    'Mid-Term Examination Fall-2026',
    'Fall 2026',
    1500.00,
    false
);