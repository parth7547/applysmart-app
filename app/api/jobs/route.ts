import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  let roles: string[] = []
  let locations: string[] = []
  let swipedJobs: string[] = []

  if (email) {

    const { data } = await supabase
      .from("user_preferences")
      .select("roles, locations")
      .eq("user_email", email)
      .single()

    if (data?.roles) roles = data.roles
    if (data?.locations) locations = data.locations

    const { data: swipeData } = await supabase
      .from("swipes")
      .select("job_title")
      .eq("user_email", email)

    if (swipeData) {
      swipedJobs = swipeData.map((s: any) => s.job_title)
    }
  }

  if (roles.length === 0) roles = ["Software Engineer"]
  if (locations.length === 0) locations = ["India"]

  let allJobs: any[] = []

  for (const role of roles) {
    for (const location of locations) {

      const query = `${role} fresher ${location}`

      const response = await fetch(
        `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(query)}&hl=en&gl=in&api_key=${process.env.SERPAPI_KEY}`,
        { next: { revalidate: 3600 } }
      )

      const json = await response.json()

      const jobs =
        json.jobs_results?.map((job: any) => ({
          title: job.title,
          company: job.company_name,
          location: job.location,
          description: job.description,
          applyLink: job.apply_options?.[0]?.link || ""
        })) || []

      allJobs = [...allJobs, ...jobs]
    }
  }

  // remove jobs already swiped
  const filteredJobs = allJobs.filter(
    job => !swipedJobs.includes(job.title)
  )

  // remove duplicates by title
  const uniqueJobs = Array.from(
    new Map(filteredJobs.map(job => [job.title, job])).values()
  )

  return NextResponse.json(uniqueJobs.slice(0, 20))
}