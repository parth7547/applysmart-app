"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {

  const { data: session, status } = useSession()

  const [appliedCount, setAppliedCount] = useState(0)
  const [rejectedCount, setRejectedCount] = useState(0)

  useEffect(() => {

    if (!session?.user?.email) return

    const fetchCounts = async () => {

      const { count: appliedTotal } = await supabase
        .from("swipes")
        .select("*", { count: "exact", head: true })
        .eq("user_email", session.user.email)
        .eq("status", "applied")

      const { count: rejectedTotal } = await supabase
        .from("swipes")
        .select("*", { count: "exact", head: true })
        .eq("user_email", session.user.email)
        .eq("status", "rejected")

      setAppliedCount(appliedTotal || 0)
      setRejectedCount(rejectedTotal || 0)
    }

    fetchCounts()

  }, [session])

  if (status === "loading") return <p>Loading...</p>
  if (!session) redirect("/")

  return (

    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-4 border-b bg-white">
        <h1 className="text-xl font-bold">ApplySmart</h1>

        <button
          onClick={() => signOut()}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Logout
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1">

        {/* Left Panel */}
        <div className="hidden md:flex w-1/4 border-r p-6 flex-col gap-4 bg-gray-50">
          <h2 className="font-bold text-lg">Activity</h2>

          <p>Applied: {appliedCount}</p>
          <p>Rejected: {rejectedCount}</p>
          <p>Saved: 0</p>
        </div>

        {/* Center */}
        <div className="flex-1 flex items-center justify-center p-6">
          <SwipeCard session={session} />
        </div>

        {/* Right Panel */}
        <div className="hidden md:flex w-1/4 border-l p-6 flex-col gap-4 bg-gray-50">
          <h2 className="font-bold text-lg">Tips</h2>

          <p className="text-sm text-gray-500">
            Swipe right to view full details and apply.
          </p>
        </div>

      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 border-t bg-white">

        <div className="flex justify-center gap-6 mb-2">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>

        <p>© ApplySmart 2026. All rights reserved.</p>

      </footer>

    </div>
  )
}

function SwipeCard({ session }: any) {

  const [jobs, setJobs] = useState<any[]>([])
  const [jobIndex, setJobIndex] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(null)

  useEffect(() => {

    const fetchJobs = async () => {

      const res = await fetch("/api/jobs")
      const data = await res.json()

      setJobs(data)
      setLoading(false)
    }

    fetchJobs()

  }, [])

  if (loading) return <p>Loading jobs...</p>
  if (!jobs.length) return <p>No jobs found.</p>

  const job = jobs[jobIndex % jobs.length]

  const handleSwipe = async (direction: string) => {

    const status = direction === "right" ? "applied" : "rejected"

    await supabase
      .from("swipes")
      .insert([
        {
          user_email: session?.user?.email || "unknown",
          job_title: job.title,
          company: job.company,
          status
        }
      ])

    if (direction === "right") {
      setShowDetails(true)
    } else {
      setJobIndex(prev => prev + 1)
    }
  }

  return (

    <div className="flex flex-col items-center">

      {/* Swipe Card */}
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
        className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden transition
        ${dragDirection === "right" ? "bg-green-50" : ""}
        ${dragDirection === "left" ? "bg-red-50" : ""}
        ${!dragDirection ? "bg-white" : ""}
        `}
      >

        {/* Banner */}
        <img
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf"
          className="h-40 w-full object-cover"
        />

        {/* Card Content */}
        <div className="p-6 text-left">

          {/* Logo + Title */}
          <div className="flex items-center gap-4 mb-4">

            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-lg font-bold">
              {job.company?.charAt(0)}
            </div>

            <div>
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.company}</p>
            </div>

          </div>

          {/* Location + Salary */}
          <div className="flex items-center gap-3 mb-4">

            <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
              📍 {job.location}
            </span>

            {job.salary && (
              <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                {job.salary}
              </span>
            )}

          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">

            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              React
            </span>

            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              JavaScript
            </span>

            <span className="text-xs bg-gray-200 px-3 py-1 rounded-full">
              API
            </span>

          </div>

          {/* Overview */}
          <p className="text-sm text-gray-600 line-clamp-3">
            {job.description}
          </p>

        </div>

      </motion.div>

      {/* Buttons */}
      <div className="flex gap-8 mt-6">

        <button
          onClick={() => handleSwipe("left")}
          className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center text-red-500 text-xl"
        >
          ✕
        </button>

        <button
          onClick={() => handleSwipe("right")}
          className="w-14 h-14 rounded-full bg-green-500 text-white shadow flex items-center justify-center text-xl"
        >
          ❤
        </button>

      </div>

      {/* Modal */}
      {showDetails && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">

            <div className="p-6 border-b">
              <h3 className="text-xl font-bold">{job.title}</h3>

              <p className="text-gray-600 text-sm">
                {job.company} • {job.location}
              </p>
            </div>

            <div className="p-6 overflow-y-auto flex-1">

              <p className="text-sm whitespace-pre-line">
                {job.description}
              </p>

            </div>

            <div className="p-6 border-t flex justify-between">

              <button
                onClick={() => {
                  setShowDetails(false)
                  setJobIndex(prev => prev + 1)
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Close
              </button>

              <button
                onClick={() => {
                  if (job.applyLink) {
                    window.open(job.applyLink, "_blank")
                  }
                }}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Apply
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}