"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AppliedJobs() {

  const { data: session, status } = useSession()
  const router = useRouter()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    if (status === "loading") return
    if (!session?.user?.email) return

    const fetchApplied = async () => {
      const { data } = await supabase
        .from("swipes")
        .select("*")
        .eq("user_email", session?.user?.email)
        .eq("status", "applied")
        .order("created_at", { ascending: false })

      setJobs(data || [])
      setLoading(false)
    }

    fetchApplied()

  }, [session, status])

  if (status === "loading" || loading) return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <h1 className="text-lg font-bold text-gray-900">ApplySmart</h1>
        </div>

        <div className="flex items-center gap-6">
          <span
            onClick={() => router.push("/dashboard")}
            className="text-sm font-medium text-gray-400 hover:text-gray-900 cursor-pointer"
          >
            Dashboard
          </span>
          <span className="text-sm font-medium text-gray-900 cursor-pointer">
            Applied
          </span>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto w-full px-6 py-10">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Applied Jobs</h2>
          <p className="text-sm text-gray-400 mt-1">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} applied so far
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 text-sm">No applied jobs yet. Start swiping!</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-lg font-bold text-indigo-600 shrink-0">
                  {job.company?.charAt(0) || "?"}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{job.job_title}</h3>
                  <p className="text-xs text-indigo-600 mt-0.5">{job.company}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(job.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-600 font-medium shrink-0">
                  Applied
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  )
}