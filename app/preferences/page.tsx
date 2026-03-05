"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Preferences() {

  const { data: session } = useSession()
  const router = useRouter()

  const [roles, setRoles] = useState<string[]>([])

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

  const toggleRole = (role:string) => {

    if (roles.includes(role)) {
      setRoles(roles.filter(r => r !== role))
    } else if (roles.length < 5) {
      setRoles([...roles, role])
    }

  }

  const savePreferences = async () => {

    await supabase.from("user_preferences").insert([
      {
        user_email: session?.user?.email,
        roles: roles
      }
    ])

    router.push("/dashboard")

  }

  return (

    <div className="min-h-screen flex flex-col items-center justify-center gap-6">

      <h1 className="text-2xl font-bold">
        Select up to 5 roles
      </h1>

      <div className="grid grid-cols-2 gap-4">

        {allRoles.map(role => (

          <button
            key={role}
            onClick={()=>toggleRole(role)}
            className={`p-3 border rounded-lg
            ${roles.includes(role) ? "bg-black text-white" : ""}
            `}
          >
            {role}
          </button>

        ))}

      </div>

      <button
        onClick={savePreferences}
        className="px-6 py-3 bg-black text-white rounded-lg"
      >
        Continue
      </button>

    </div>

  )
}