"use client"

import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react"

export default function RecruiterLogin() {

  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/recruiter/dashboard"
    }
  }, [status])

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
        
        <a href="/" className="text-sm text-gray-500 hover:text-gray-900">
          For Job Seekers →
        </a>
      </nav>

      {/* Hero */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-md text-center">

          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl mx-auto mb-6">
            💼
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Jobs on ApplySmart</h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Reach thousands of fresh graduates actively looking for jobs. Post your openings and get discovered.
          </p>

          <button
            onClick={() => signIn("google")}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
          >
            Continue as Recruiter with Google
          </button>

          <p className="text-xs text-gray-400 mt-4">
            Looking for a job instead?{" "}
            <a href="/" className="text-indigo-600 hover:underline">Go to Job Seeker login</a>
          </p>

        </div>
      </div>

    </div>
  )
}