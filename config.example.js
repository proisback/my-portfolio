// ============================================================================
// Notify-Me Signup — Supabase credentials (example / template)
// ============================================================================
// 1. Copy this file to `config.js` in the same directory.
// 2. Paste your Supabase Project URL and anon key below.
// 3. Save. The signup form will pick them up on next page load.
//
// Where to find them:
//   Supabase dashboard → your project → Project Settings → API
//     - "Project URL"                             → SUPABASE_URL
//     - "Project API keys" → "anon / public"      → SUPABASE_ANON_KEY
//
// The anon key is safe to expose in client-side code — Supabase's Row Level
// Security (RLS) is what actually protects your data. Just make sure:
//   - RLS is enabled on the `subscribers` table
//   - The `anon` role has an INSERT policy (and nothing else) for that table
//   - The table is exposed via Project Settings → Data API → Exposed tables
//
// If either value is left as a placeholder, the signup form still validates
// the email and shows the success state, but skips the database write.
// Nothing will break.
// ============================================================================

window.__NEWSLETTER_CONFIG__ = {
  SUPABASE_URL:      'YOUR_SUPABASE_PROJECT_URL_HERE',
  SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY_HERE',
  SUPABASE_TABLE:    'subscribers',
};
