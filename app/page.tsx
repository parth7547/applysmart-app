"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "authenticated") {
    window.location.href = "/dashboard"
  }

  return (
    <main className="min-h-screen bg-white text-black">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <h1 className="text-xl font-bold">ApplySmart</h1>

        {session ? (
          <button
            onClick={() => signOut()}
            className="px-4 py-2 border rounded-lg"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="px-4 py-2 border rounded-lg"
          >
            Login
          </button>
        )}
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-24">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Swipe Your Way To The Right Job
        </h2>

        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Discover curated jobs for fresh graduates in India. No clutter. No stress.
        </p>

        {session && (
          <p className="text-green-600 mb-4">
            Logged in as {session.user?.email}
          </p>
        )}

        {!session && (
          <button
            onClick={() => signIn("google")}
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Get Started
          </button>
        )}
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 px-8 py-20 bg-gray-50">
        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-2">Personalized Jobs</h3>
          <p className="text-gray-600 text-sm">
            Only see jobs based on your preferences and skills.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-2">Swipe Interface</h3>
          <p className="text-gray-600 text-sm">
            Swipe right to apply, left to skip. Simple and fast.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-2">Track Applications</h3>
          <p className="text-gray-600 text-sm">
            Keep track of jobs you applied to in one place.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t text-sm text-gray-500">
        © 2026 ApplySmart. Built for Fresh Graduates in India.
      </footer>

    </main>
  )
}