import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")
  
  const { data } = await supabase
    .from("user_preferences")
    .select("roles")
    .eq("user_email", email)
    .single()

  return NextResponse.json({ hasPreferences: !!data })
}