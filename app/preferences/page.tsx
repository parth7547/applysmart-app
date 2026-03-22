"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Preferences() {

  const { data: session } = useSession()
  const router = useRouter()

  const [roles, setRoles] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
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

  const allLocations = [
    "Mumbai",
    "Navi Mumbai",
    "Pune",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Delhi/NCR",
    "Noida",
    "Gurgaon",
    "Kolkata",
    "Ahmedabad",
    "Kochi",
    "Chandigarh",
    "Remote"
  ]

  const toggleRole = (role: string) => {
    if (roles.includes(role)) {
      setRoles(roles.filter(r => r !== role))
    } else if (roles.length < 5) {
      setRoles([...roles, role])
    }
  }

  const toggleLocation = (location: string) => {
    if (locations.includes(location)) {
      setLocations(locations.filter(l => l !== location))
    } else if (locations.length < 5) {
      setLocations([...locations, location])
    }
  }

  const savePreferences = async () => {

    if (!session?.user?.email) return

    if (roles.length === 0) {
      alert("Please select at least one role")
      return
    }

    if (locations.length === 0) {
      alert("Please select at least one location")
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from("user_preferences")
      .upsert(
        { user_email: session.user.email, roles, locations },
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

          {/* Roles Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Choose your roles</h2>
            <p className="text-sm text-gray-400 mb-4">
              Select up to 5 roles. We'll find jobs matching your preferences.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-3">
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

            <p className="text-xs text-gray-400">
              {roles.length} of 5 roles selected
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mb-8" />

          {/* Locations Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Preferred locations</h2>
            <p className="text-sm text-gray-400 mb-4">
              Select up to 5 locations. We'll prioritize jobs in these cities.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {allLocations.map(location => (
                <button
                  key={location}
                  onClick={() => toggleLocation(location)}
                  className={`p-3 rounded-xl text-sm font-medium border transition text-left
                    ${locations.includes(location)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                >
                  {locations.includes(location) && <span className="mr-2">✓</span>}
                  {location}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400">
              {locations.length} of 5 locations selected
            </p>
          </div>

          <button
            onClick={savePreferences}
            disabled={saving || roles.length === 0 || locations.length === 0}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Continue to Dashboard →"}
          </button>

        </div>

      </div>

    </div>
  )
}