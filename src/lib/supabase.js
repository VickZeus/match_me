import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SECRET_ACCESS_KEY
if (!url || !key) throw new Error("Supabase env vars are not set")

export const supabase = createClient(url, key, {
    auth: { persistSession: false },
})