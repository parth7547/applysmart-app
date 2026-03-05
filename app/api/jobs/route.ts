import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_jobs&q=software+engineer+fresher+india&api_key=${process.env.SERPAPI_KEY}`
    )

    const data = await response.json()

    const jobs =
      data.jobs_results?.slice(0, 10).map((job: any) => ({
        title: job.title,
        company: job.company_name,
        location: job.location,
        description: job.description,
        applyLink: job.apply_options?.[0]?.link || ""
      })) || []

    return NextResponse.json(jobs)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    )
  }
}