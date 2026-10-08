// Supabase credentials for the notify-me signup.
//
// PUBLIC KEYS, SAFE TO COMMIT. This is the Supabase Project URL and the
// *anon* key, which is designed to live in client-side code: it only permits
// what Row Level Security allows (an INSERT-only policy for `anon` on the
// `subscribers` table, and the table exposed via Data API). This is NOT the
// `service_role` key; that one must never appear in client code.
//
// Set either value to a `YOUR_...` placeholder to run the form in local-only
// mode: validation and the success state still work, nothing is written.
export const SUPABASE_URL = 'https://rcqlnxytcibbsxgcsoid.supabase.co';

export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjcWxueHl0Y2liYnN4Z2Nzb2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNDE4MDMsImV4cCI6MjA5MjYxNzgwM30.5IgIic5zHbhhXqQhAvoK4Nr_6LiYaZz3BTUDxrZMJS4';

export const SUPABASE_TABLE = 'subscribers';
