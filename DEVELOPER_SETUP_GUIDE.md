# 🚀 DEVELOPER SETUP SCRIPT: Client Handoff Setup

## Step 1: Create Supabase Project for Client

### 1.1 Create New Supabase Project
1. Go to [supabase.com](https://supabase.com) 
2. Create new project:
   - **Name**: `linque-website-production`
   - **Password**: `LinqueDB2024!` (save this!)
   - **Region**: US East (or closest to client)

### 1.2 Set Up Database Schema
Copy and paste this SQL in Supabase SQL Editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create posts table
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  category text,
  tags text[] default '{}',
  excerpt text,
  description text,
  hero_image text,
  read_time_minutes integer default 5,
  content jsonb default '[]'::jsonb,
  status text not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create jobs table
create table if not exists public.jobs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  location text,
  employment_type text,
  department text,
  remote_type text,
  summary text,
  description text,
  responsibilities jsonb default '[]'::jsonb,
  qualifications jsonb default '[]'::jsonb,
  salary_range text,
  apply_email text,
  apply_url text,
  status text not null default 'draft',
  posted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Update timestamp function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers
drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at
before update on public.posts
for each row execute procedure public.handle_updated_at();

drop trigger if exists jobs_updated_at on public.jobs;
create trigger jobs_updated_at
before update on public.jobs
for each row execute procedure public.handle_updated_at();

-- Enable RLS
alter table public.posts enable row level security;
alter table public.jobs enable row level security;

-- Public read policies (drop and recreate to avoid conflicts)
drop policy if exists "Public posts can be read" on public.posts;
create policy "Public posts can be read"
  on public.posts for select
  using (status = 'published');

drop policy if exists "Public jobs can be read" on public.jobs;
create policy "Public jobs can be read"
  on public.jobs for select
  using (status = 'published');

-- Admin management policies (drop and recreate to avoid conflicts)
drop policy if exists "Admins manage posts" on public.posts;
create policy "Admins manage posts"
  on public.posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Admins manage jobs" on public.jobs;
create policy "Admins manage jobs"
  on public.jobs for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- SECURITY NOTE: Also disable public signups in Supabase Dashboard:
-- Go to Authentication > Settings > "Enable email confirmations" = ON
-- Go to Authentication > Settings > "Enable signup" = OFF (after creating admin account)
```

### 1.3 Get Credentials
From Supabase Settings > API:
- **Project URL**: `https://[project-id].supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqdWxtdG5jb3pnenVud2ZzcW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MDg4NjMsImV4cCI6MjA3NjM4NDg2M30.IVDPTZZyn9caL_XlhV-nyJeWgi-Vp8zMFkjPL7LMCeU` (long string)

**📝 SAVE THESE CREDENTIALS** - you'll need them for Netlify!

---

## Step 2: Configure Netlify for Client

### 2.1 Environment Variables
In Netlify Site Settings > Environment Variables, add:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://[your-project-id].supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJ[your-anon-key]` |

### 2.2 Custom Domain Setup (Optional but Recommended)
If client has custom domain:
1. In Netlify: Site Settings > Domain Management
2. Add custom domain: `linqueresourcing.com`
3. Add admin subdomain: `admin.linqueresourcing.com`
4. Point both to your Netlify site

### 2.3 Deploy
1. Push your code to GitHub
2. Trigger new deployment in Netlify
3. Verify deployment succeeds

---

## Step 3: Create Client Admin Account

### 3.1 Create Admin User
1. Go to `https://admin.linqueresourcing.com` (or your admin URL)
2. Click "Initial setup? Create admin account"
3. Create account:
   - **Email**: `etoure33@gmail.com`
   - **Password**: `HelloWorld2025`
4. Confirm email if required

### 3.2 Secure the Authentication
**IMPORTANT: Do this immediately after creating the admin account!**

1. In Supabase Dashboard: Authentication > Settings
2. **Disable public signups**:
   - Set "Enable signup" to **OFF**
   - This prevents anyone else from creating accounts
3. **Enable email confirmations**:
   - Set "Enable email confirmations" to **ON**
   - Adds extra security layer

### 3.3 Test Admin Functionality
1. Log in with admin credentials
2. Create a test blog post
3. Create a test job posting
4. Publish both and verify they appear on main site

---

## Step 4: Populate Initial Content (Optional)

### 4.1 Sample Blog Post
Create a sample post to show the client how it works:
- **Title**: "Welcome to Your New Website"
- **Category**: "Company News"
- **Status**: Published

### 4.2 Sample Job Posting
Create a sample job to demonstrate:
- **Title**: "Example Position"
- **Location**: "Remote"
- **Status**: Draft (so it doesn't go live)

---

## Step 5: Client Handoff

### 5.1 Provide Client With:
- [ ] `CLIENT_HANDOFF_GUIDE.md` (already created)
- [ ] Admin URL: `https://admin.linqueresourcing.com`
- [ ] Login credentials: `etoure33@gmail.com` / `HelloWorld2025`
- [ ] Instruction to change password immediately after first login

### 5.2 Walk-Through Session (Recommended)
Schedule 30-minute call to:
- [ ] Show them how to log in
- [ ] Demonstrate creating a blog post
- [ ] Demonstrate creating a job posting
- [ ] Show them draft vs published
- [ ] Answer any questions

### 5.3 Emergency Access (Keep for Support)
Document for your records:
- Supabase project admin access
- Netlify site admin access
- GitHub repository access
- Domain registrar access (if applicable)

---

## 🔐 Security Checklist
- [ ] Client changes default password
- [ ] Supabase RLS policies are active
- [ ] Admin panel only accessible via HTTPS
- [ ] Environment variables secured in Netlify
- [ ] `.env` files in `.gitignore`

---

## 📞 Support Plan
**For the first 30 days:**
- [ ] Client can email you with questions
- [ ] You monitor for any technical issues
- [ ] Help with any content migration needs

**After handoff:**
- [ ] Client manages content independently
- [ ] You provide technical support only if needed
- [ ] System is fully self-sufficient

---

**🎉 HANDOFF COMPLETE!**
Your client now has a fully functional, professional content management system they can use independently.