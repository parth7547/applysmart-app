"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Profile() {

  const { data: session, status } = useSession()
  const router = useRouter()

  const [roles, setRoles] = useState<string[]>([])
  const [appliedCount, setAppliedCount] = useState(0)
  const [rejectedCount, setRejectedCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    if (status === "loading") return
    if (!session?.user?.email) return

    const fetchData = async () => {

      const { data: prefData } = await supabase
        .from("user_preferences")
        .select("roles")
        .eq("user_email", session?.user?.email)
        .single()

      if (prefData?.roles) setRoles(prefData.roles)

      const { count: appliedTotal } = await supabase
        .from("swipes")
        .select("*", { count: "exact", head: true })
        .eq("user_email", session?.user?.email)
        .eq("status", "applied")

      const { count: rejectedTotal } = await supabase
        .from("swipes")
        .select("*", { count: "exact", head: true })
        .eq("user_email", session?.user?.email)
        .eq("status", "rejected")

      setAppliedCount(appliedTotal || 0)
      setRejectedCount(rejectedTotal || 0)
      setLoading(false)
    }

    fetchData()

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
          <span
            onClick={() => router.push("/applied")}
            className="text-sm font-medium text-gray-400 hover:text-gray-900 cursor-pointer"
          >
            Applied
          </span>
          <span className="text-sm font-medium text-gray-900 cursor-pointer">
            Profile
          </span>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto w-full px-6 py-10 flex flex-col gap-5">

        {/* Avatar + Name + Email */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 shrink-0">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="avatar"
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              session?.user?.name?.charAt(0) || "U"
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">{session?.user?.name}</h2>
            <p className="text-sm text-gray-400">{session?.user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Your Stats</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-500">{appliedCount}</p>
              <p className="text-xs text-gray-500 mt-1">Jobs Applied</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-red-400">{rejectedCount}</p>
              <p className="text-xs text-gray-500 mt-1">Jobs Skipped</p>
            </div>
          </div>
        </div>

        {/* Selected Roles */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Your Preferred Roles</p>

          {roles.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No roles selected.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {roles.map(role => (
                <span
                  key={role}
                  className="text-sm px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/preferences")}
            className="w-full py-3 border border-indigo-200 text-indigo-600 text-sm font-medium rounded-xl hover:bg-indigo-50 transition"
          >
            ⚙️ Edit Preferences
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full py-3 border border-red-200 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>

      </div>

    </div>
  )
}
