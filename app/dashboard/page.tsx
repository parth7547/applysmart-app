"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {

  const { data: session, status } = useSession()

  const [checkingPreferences, setCheckingPreferences] = useState(true)
  const [appliedCount, setAppliedCount] = useState(0)
  const [rejectedCount, setRejectedCount] = useState(0)
  const [activityFeed, setActivityFeed] = useState<{ title: string, company: string, status: string }[]>([])

  useEffect(() => {

    if (status === "loading") return
    if (!session?.user?.email) return

    const checkPreferences = async () => {

      const res = await fetch(`/api/preferences?email=${session?.user?.email}`)
      const data = await res.json()

      if (!data.hasPreferences) {
        window.location.href = "/preferences"
        return
      }

      setCheckingPreferences(false)
    }

    checkPreferences()

  }, [session])

  useEffect(() => {

    const email = session?.user?.email
    if (!email) return

    const fetchCounts = async () => {

      const { count: appliedTotal } = await supabase
        .from("swipes")
        .select("*", { count: "exact", head: true })
        .eq("user_email", email)
        .eq("status", "applied")

      const { count: rejectedTotal } = await supabase
        .from("swipes")
        .select("*", { count: "exact", head: true })
        .eq("user_email", email)
        .eq("status", "rejected")

      setAppliedCount(appliedTotal || 0)
      setRejectedCount(rejectedTotal || 0)
    }

    fetchCounts()

  }, [session])

  if (status === "loading") return <p className="flex items-center justify-center min-h-screen">Loading...</p>
  if (!session) redirect("/")
  if (checkingPreferences) return <p className="flex items-center justify-center min-h-screen">Checking preferences...</p>

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">

      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <h1 className="text-lg font-bold text-gray-900">ApplySmart</h1>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer">Dashboard</span>
          <span
            onClick={() => window.location.href = "/applied"}
            className="text-sm font-medium text-gray-400 hover:text-gray-900 cursor-pointer"
          >
            Applied
          </span>
          <div
            onClick={() => window.location.href = "/profile"}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition"
          >
            {session?.user?.name?.charAt(0) || "U"}
          </div>
          <button
            onClick={() => signOut()}
            className="text-sm text-gray-500 hover:text-gray-900 uppercase tracking-wide font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-8 gap-6">

        {/* Left Panel */}
        <div className="hidden md:flex w-72 flex-col gap-4">

          {/* My Activity Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">My Activity</p>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-700">Applied</span>
              <span className="text-sm font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                {appliedCount}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-700">Rejected</span>
              <span className="text-sm font-bold text-red-400 bg-red-50 px-2 py-0.5 rounded-full">
                {rejectedCount}
              </span>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Recent Activity</p>

            {activityFeed.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No activity yet. Start swiping!</p>
            ) : (
              <div className="flex flex-col gap-3">
                {activityFeed.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${item.status === "applied" ? "bg-green-500" : "bg-red-400"}`}></span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 leading-tight truncate">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.company}</p>
                    </div>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full shrink-0 font-medium
                      ${item.status === "applied" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-400"}`}>
                      {item.status === "applied" ? "✅" : "❌"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Change Preferences */}
          <button
            onClick={() => window.location.href = "/preferences"}
            className="w-full py-3 border border-indigo-200 text-indigo-600 text-sm font-medium rounded-xl hover:bg-indigo-50 transition"
          >
            ⚙️ Change Preferences
          </button>

        </div>

        {/* Center — Swipe Card */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <SwipeCard
            session={session}
            incrementApplied={() => setAppliedCount(prev => prev + 1)}
            incrementRejected={() => setRejectedCount(prev => prev + 1)}
            addToFeed={(item: { title: string, company: string, status: string }) =>
              setActivityFeed(prev => [item, ...prev])
            }
          />
        </div>

        {/* Right Panel */}
        <div className="hidden md:flex w-72 flex-col gap-4">

          {/* Pro Tip Card */}
          <div className="bg-indigo-700 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-indigo-200 uppercase tracking-widest mb-2">Pro Tip</p>
            <p className="text-sm text-white leading-relaxed">
              Swipe right to view full job details before applying. Read the description carefully to tailor your application.
            </p>
          </div>

          {/* What's Happening Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">What's Happening</p>

            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                <p className="text-sm text-gray-600">New fresher jobs added daily from top Indian companies.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0"></span>
                <p className="text-sm text-gray-600">Swipe faster, apply smarter. Your next job is one swipe away.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className="text-center py-5 text-xs text-gray-400 border-t bg-white">
        <div className="flex justify-center gap-6 mb-1">
          <a href="#" className="hover:text-gray-600">Privacy</a>
          <a href="#" className="hover:text-gray-600">Terms</a>
          <a href="#" className="hover:text-gray-600">Contact</a>
        </div>
        <p>© ApplySmart 2026. All rights reserved.</p>
      </footer>

    </div>
  )
}

function SwipeCard({
  session,
  incrementApplied,
  incrementRejected,
  addToFeed
}: any) {

  const [jobs, setJobs] = useState<any[]>([])
  const [jobIndex, setJobIndex] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(null)

  useEffect(() => {

    if (!session?.user?.email) return

    const fetchJobs = async () => {
      try {
        const res = await fetch(`/api/jobs?email=${session.user.email}`)
        const data = await res.json()
        setJobs(data)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()

  }, [session?.user?.email])

  if (loading) return (
    <div className="flex flex-col items-center gap-3 text-gray-400">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-sm">Finding jobs for you...</p>
    </div>
  )

  if (!jobs.length) return <p className="text-gray-500 text-sm">No jobs found.</p>

  if (jobIndex >= jobs.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-5xl">🎉</p>
        <h2 className="text-xl font-bold text-gray-800">You're all caught up!</h2>
        <p className="text-gray-400 text-sm">No more jobs to review right now. Check back later.</p>
        <button
          onClick={() => setJobIndex(0)}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
        >
          Start Over
        </button>
      </div>
    )
  }

  const job = jobs[jobIndex]
  const defaultTags = ["Fresher", "Full Time"]
  const tags = job.tags?.length ? job.tags : defaultTags

  const handleSwipe = async (direction: string) => {
    if (direction === "right") {
      setShowDetails(true)
      return
    }

    await supabase
      .from("swipes")
      .insert([{
        user_email: session?.user?.email || "unknown",
        job_title: job.title,
        company: job.company,
        status: "rejected"
      }])

    incrementRejected()
    addToFeed({ title: job.title, company: job.company, status: "rejected" })
    setJobIndex(prev => prev + 1)
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xl">

      <motion.div
        key={jobIndex}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDrag={(event, info) => {
          if (info.offset.x > 50) setDragDirection("right")
          else if (info.offset.x < -50) setDragDirection("left")
          else setDragDirection(null)
        }}
        onDragEnd={(event, info) => {
          setDragDirection(null)
          if (info.offset.x > 120) handleSwipe("right")
          if (info.offset.x < -120) handleSwipe("left")
        }}
        className={`w-full rounded-2xl shadow-md overflow-hidden cursor-grab active:cursor-grabbing transition-colors duration-150
          ${dragDirection === "right" ? "bg-green-50 ring-2 ring-green-300" : ""}
          ${dragDirection === "left" ? "bg-red-50 ring-2 ring-red-300" : ""}
          ${!dragDirection ? "bg-white" : ""}
        `}
      >

        {/* Card Header with background image */}
        <div className="h-36 relative overflow-hidden">
          <img
            src={`https://picsum.photos/seed/${jobIndex + 1}/600/200`}
            alt="job background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-3 left-3 w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center text-lg font-bold text-indigo-600">
            {job.company?.charAt(0) || "?"}
          </div>

          {dragDirection === "right" && (
            <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full rotate-[-12deg]">
              APPLY ✓
            </div>
          )}
          {dragDirection === "left" && (
            <div className="absolute top-4 right-4 bg-red-400 text-white text-xs font-bold px-3 py-1 rounded-full rotate-[12deg]">
              SKIP ✕
            </div>
          )}
        </div>

        <div className="p-6">

          <h3 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h3>
          <p className="text-indigo-600 font-medium text-sm mt-1">{job.company}</p>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              📍 {job.location}
            </span>
            {job.salary && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                {job.salary}
              </span>
            )}
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium border border-indigo-100"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Role Overview</p>
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {job.description}
            </p>
          </div>

        </div>
      </motion.div>

      {/* Swipe Buttons */}
      <div className="flex gap-8 mt-6">
        <button
          onClick={() => handleSwipe("left")}
          className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-red-400 text-xl hover:shadow-lg hover:scale-105 transition-transform"
        >
          ✕
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="w-14 h-14 rounded-full bg-green-500 text-white shadow-md flex items-center justify-center text-xl hover:shadow-lg hover:scale-105 transition-transform"
        >
          ❤
        </button>
      </div>

      {/* Detail Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">

            <div className="p-6 border-b flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-xl font-bold text-indigo-600 shrink-0">
                {job.company?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                <p className="text-indigo-600 text-sm font-medium">{job.company}</p>
                <p className="text-gray-400 text-xs mt-0.5">📍 {job.location}</p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex gap-2 flex-wrap mb-4">
                {tags.map((tag: string) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Job Description</p>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {job.description}
              </p>
            </div>

            <div className="p-6 border-t flex justify-between">
              <button
                onClick={async () => {
                  await supabase
                    .from("swipes")
                    .insert([{
                      user_email: session?.user?.email || "unknown",
                      job_title: job.title,
                      company: job.company,
                      status: "rejected"
                    }])
                  incrementRejected()
                  addToFeed({ title: job.title, company: job.company, status: "rejected" })
                  setShowDetails(false)
                  setJobIndex(prev => prev + 1)
                }}
                className="px-5 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 text-gray-600"
              >
                Skip
              </button>

              <button
                onClick={async () => {
                  await supabase
                    .from("swipes")
                    .insert([{
                      user_email: session?.user?.email || "unknown",
                      job_title: job.title,
                      company: job.company,
                      status: "applied"
                    }])
                  incrementApplied()
                  addToFeed({ title: job.title, company: job.company, status: "applied" })
                  setShowDetails(false)
                  setJobIndex(prev => prev + 1)
                  if (job.applyLink && job.applyLink.trim() !== "") {
                    window.open(job.applyLink, "_blank")
                  } else {
                    alert("No apply link available for this job.")
                  }
                }}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
              >
                Apply Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}