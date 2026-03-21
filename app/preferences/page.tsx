"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Preferences() {

  const { data: session } = useSession()
  const router = useRouter()

  const [roles, setRoles] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const allRoles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Data Analyst",
    "AI Engineer",
    "Machine Learning Engineer",
    "Full Stack Developer",
    "DevOps Engineer"
  ]

  const toggleRole = (role: string) => {
    if (roles.includes(role)) {
      setRoles(roles.filter(r => r !== role))
    } else if (roles.length < 5) {
      setRoles([...roles, role])
    }
  }

  const savePreferences = async () => {

    if (!session?.user?.email) return

    if (roles.length === 0) {
      alert("Please select at least one role")
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from("user_preferences")
      .upsert(
        { user_email: session.user.email, roles },
        { onConflict: "user_email" }
      )

    if (error) {
      console.error("Supabase error:", error.message)
      alert(error.message)
      setSaving(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">

      {/* Navbar */}
      <nav className="flex items-center px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <h1 className="text-lg font-bold text-gray-900">ApplySmart</h1>
        </div>
      </nav>

      {/* Main */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-lg">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Choose your roles</h2>
            <p className="text-sm text-gray-400">
              Select up to 5 roles. We'll find jobs matching your preferences.
            </p>
          </div>

          {/* Role Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {allRoles.map(role => (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className={`p-3 rounded-xl text-sm font-medium border transition text-left
                  ${roles.includes(role)
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
              >
                {roles.includes(role) && <span className="mr-2">✓</span>}
                {role}
              </button>
            ))}
          </div>

          {/* Selected count */}
          <p className="text-xs text-gray-400 mb-4">
            {roles.length} of 5 roles selected
          </p>

          <button
            onClick={savePreferences}
            disabled={saving || roles.length === 0}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Continue to Dashboard →"}
          </button>

        </div>

      </div>

    </div>
  )
}