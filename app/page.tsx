"use client"

import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react"

export default function Home() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/dashboard"
    }
  }, [status])

  return (
    <main className="min-h-screen bg-[#f0f2f5] text-gray-900 flex flex-col">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <h1 className="text-lg font-bold text-gray-900">ApplySmart</h1>
        </div>

        <button
          onClick={() => signIn("google")}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
        >
          Login with Google
        </button>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-28">

        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full mb-6">
          Built for Fresh Graduates in India
        </span>

        <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
          Swipe Your Way<br />To The Right Job
        </h2>

        <p className="text-lg text-gray-500 max-w-xl mb-10 leading-relaxed">
          Discover curated fresher jobs across India. No clutter, no stress — just swipe right to apply.
        </p>

        <button
          onClick={() => signIn("google")}
          className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-base font-medium hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
        >
          Get Started — It's Free
        </button>

        <p className="text-xs text-gray-400 mt-4">No signup required. Login with Google in seconds.</p>

      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 px-8 py-16 max-w-5xl mx-auto w-full">

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mb-4">🎯</div>
          <h3 className="font-semibold text-base mb-2 text-gray-900">Personalized Jobs</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Only see jobs based on your selected roles and preferences. No irrelevant listings.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mb-4">👆</div>
          <h3 className="font-semibold text-base mb-2 text-gray-900">Swipe Interface</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Swipe right to apply, left to skip. Fast, simple, and stress-free job discovery.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mb-4">📊</div>
          <h3 className="font-semibold text-base mb-2 text-gray-900">Track Applications</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Keep track of every job you applied to or skipped — all in one clean dashboard.
          </p>
        </div>

      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t bg-white text-xs text-gray-400 mt-auto">
        © 2026 ApplySmart. Built for Fresh Graduates in India.
      </footer>

    </main>
  )
}