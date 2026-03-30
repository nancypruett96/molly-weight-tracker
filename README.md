# Molly's Weight Tracker

A polished, personal weight tracking web app built as a Mother's Day gift. Replaces the deprecated weight tracking features from Weight Watchers with a clean, modern interface that Molly can use from any browser.

---

## What This App Does

- **Log weekly weigh-ins** — date, weight in lbs, and an optional note
- **Trend chart** — visualizes progress over 3 months, 6 months, 1 year, or all time, with a goal weight reference line
- **Stats bar** — current weight, total lost since start, lbs remaining to goal, and weekly check-in streak
- **Milestone badges** — 8 milestone achievements (first log, 1/5/10 lbs lost, streak badges, goal reached)
- **Full history table** — every weigh-in with week-over-week change and delete option
- **Bulk import** — paste historical data in `date, weight` format to load years of WW history at once (ready for when the WW data export arrives)

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Database | Supabase (free tier Postgres) |
| Hosting | Vercel (free tier) |
| Updates | Push to GitHub → auto-deploys in ~60 seconds |

---

## Files Created

```
molly-weight-tracker/
├── index.html                  # App shell
├── package.json                # Dependencies
├── vite.config.js              # Vite build config
├── tailwind.config.js          # Tailwind theme (teal palette)
├── postcss.config.js           # PostCSS config for Tailwind
├── .env.example                # Template for environment variables
├── .gitignore                  # Excludes .env and node_modules
├── supabase-setup.sql          # SQL to run once in Supabase to create the table
├── public/
│   └── favicon.svg             # App icon (scale icon, teal)
└── src/
    ├── main.jsx                # React entry point
    ├── index.css               # Tailwind base + custom scrollbar
    ├── App.jsx                 # Root component, routing, data fetching
    ├── lib/
    │   ├── supabase.js         # Supabase client (reads from .env)
    │   └── data.js             # All DB operations (fetch, add, delete, bulk insert)
    └── components/
        ├── StatsBar.jsx        # 4-card stats row (weight, lost, to goal, streak)
        ├── WeightChart.jsx     # Recharts line chart with time range filter
        ├── WeightEntry.jsx     # Weigh-in form with date picker and note field
        ├── Milestones.jsx      # Badge grid with 8 milestones
        ├── HistoryTable.jsx    # Sortable history with week-over-week diff
        └── BulkImport.jsx      # Modal for pasting/importing historical data
```

---

## First-Time Setup (do this once)

### Step 1 — Install dependencies

```bash
cd molly-weight-tracker
npm install
```

### Step 2 — Create a Supabase project (free)

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click **New Project**, give it a name (e.g. `molly-tracker`), set a database password, pick a region closest to Virginia
3. Once the project loads, go to **SQL Editor** in the left sidebar
4. Paste the contents of `supabase-setup.sql` and click **Run**
5. Go to **Project Settings → API**
6. Copy your **Project URL** and **anon/public key**

### Step 3 — Create your .env file

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase values:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4 — Run locally to test

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). You should see the app with the setup notice replaced by the real dashboard.

---

## Deploying to Vercel (so Molly can access it from her Mac)

### Step 1 — Push to GitHub

```bash
gh repo create molly-weight-tracker --public --source . --push
```

Or manually:
```bash
git remote add origin https://github.com/YOUR_USERNAME/molly-weight-tracker.git
git push -u origin main
```

### Step 2 — Connect Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Select the `molly-weight-tracker` repo
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click **Deploy**

Vercel will give you a URL like `molly-weight-tracker.vercel.app`. That's the link Molly bookmarks.

### Step 3 — Set up Molly's Mac

1. Send Molly the Vercel URL
2. She opens it in Safari or Chrome and bookmarks it
3. Optional: In Safari, go to **File → Add to Dock** to give her a one-click icon that looks like a real app

---

## Shipping Updates to Molly

Any time you add a feature or fix something:

```bash
git add -A
git commit -m "describe what you changed"
git push
```

Vercel auto-deploys within ~60 seconds. Molly refreshes her page and has the new version. No installer, no files to send, nothing for her to do.

---

## Importing Molly's WW History

When the WW data export arrives (emailed to pruettmolly@aol.com), the data will likely be a CSV. In the app, click **"Import data"** in the top right corner and paste rows in this format:

```
2024-01-08, 172.6, optional note
2024-01-15, 172.0
2024-01-22, 171.6
```

Accepted date formats: `YYYY-MM-DD`, `MM/DD/YYYY`, `Jan 8 2024`

The import screen handles duplicates gracefully — re-importing the same date updates the existing entry rather than creating a duplicate.

---

## Known Profile Data (pre-loaded logic)

The app has Molly's profile baked in to the stats calculations:

| Field | Value |
|---|---|
| Start weight | 181.4 lbs |
| Start date | February 17, 2019 |
| Goal weight | 170 lbs |
| Height | 5'10" (used for BMI) |
| Weigh-in day | Monday |

To update any of these, edit the constants at the top of `src/components/StatsBar.jsx` and `src/components/Milestones.jsx`.

---

## Adding New Features

Open this project folder with Claude (Cowork mode) and describe what you want. The codebase is intentionally simple — one component per feature — so changes are isolated and easy to make without breaking anything else.

Good next features to consider:
- Intermittent fasting window tracker
- Monthly summary view
- Export history to PDF for doctor visits
- Custom goal weight editor in the UI
- Gentle email/notification reminders on weigh-in day (Monday)
