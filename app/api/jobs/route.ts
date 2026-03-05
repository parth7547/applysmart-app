import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  const { data } = await supabase
    .from("user_preferences")
    .select("roles")
    .eq("user_email", email)
    .single()

  const role = data?.roles?.[0] || "software engineer fresher india"

  const response = await fetch(
    `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(role + " india fresher")}&api_key=${process.env.SERPAPI_KEY}`,
    {
      next: { revalidate: 3600 }
    }
  )

  const json = await response.json()

  const jobs =
    json.jobs_results?.slice(0,10).map((job:any)=>({

      title: job.title,
      company: job.company_name,
      location: job.location,
      description: job.description,
      applyLink: job.apply_options?.[0]?.link || ""

    })) || []

  return NextResponse.json(jobs)

}