// ============================================================================
// Email Gate — Supabase credentials
// ============================================================================
//
//   ╭────────────────────────────────────────────────────────────────────╮
//   │  PUBLIC KEYS — SAFE TO COMMIT TO A PUBLIC REPOSITORY.             │
//   │                                                                    │
//   │  The values below are the Supabase *Project URL* and *anon key*.  │
//   │  Supabase anon keys are designed to live in client-side code —    │
//   │  they only permit what Row Level Security (RLS) explicitly allows.│
//   │  The real protection on this data is the RLS policy on the        │
//   │  `subscribers` table, not the secrecy of this key.                │
//   │                                                                    │
//   │  This is NOT a `service_role` key. That key (which bypasses RLS)  │
//   │  must never appear in client code or a public repo.               │
//   ╰────────────────────────────────────────────────────────────────────╯
//
// Where to find these values:
//   Supabase dashboard → your project → Project Settings → API
//     - "Project URL"                           → SUPABASE_URL
//     - "Project API keys" → "anon / public"    → SUPABASE_ANON_KEY
//
// RLS checklist for the `subscribers` table:
//   1. RLS enabled on the table
//   2. INSERT policy for the `anon` role (and nothing else) — no SELECT,
//      UPDATE, or DELETE from anon, or the list becomes publicly readable.
//   3. Table exposed via Project Settings → Data API → Exposed tables.
//
// If either value is left as a placeholder (`YOUR_...`), the gate will still
// validate the email and let the visitor through — it just skips the database
// write. By design, the gate never blocks the portfolio.
// ============================================================================

window.__GATE_CONFIG__ = {
  // Public — Supabase Project URL
  SUPABASE_URL:      'https://rcqlnxytcibbsxgcsoid.supabase.co',

  // Public — Supabase anon key (JWT). Protected by RLS, not by secrecy.
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjcWxueHl0Y2liYnN4Z2Nzb2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNDE4MDMsImV4cCI6MjA5MjYxNzgwM30.5IgIic5zHbhhXqQhAvoK4Nr_6LiYaZz3BTUDxrZMJS4',

  SUPABASE_TABLE:    'subscribers',
};
