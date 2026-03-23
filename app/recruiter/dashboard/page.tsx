"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function RecruiterDashboard() {

  const { data: session, status } = useSession()
  const router = useRouter()

  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    apply_link: "",
    salary: ""
  })

  useEffect(() => {
    if (status === "loading") return
    if (!session?.user?.email) {
      router.push("/recruiter")
      return
    }
    fetchJobs()
  }, [session, status])

  const fetchJobs = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("posted_jobs")
      .select("*")
      .eq("recruiter_email", session?.user?.email)
      .order("created_at", { ascending: false })

    setJobs(data || [])
    setLoading(false)
  }

  const handleSubmit = async () => {

    if (!form.title || !form.company || !form.location || !form.description) {
      alert("Please fill in all required fields.")
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from("posted_jobs")
      .insert([{
        recruiter_email: session?.user?.email,
        title: form.title,
        company: form.company,
        location: form.location,
        description: form.description,
        apply_link: form.apply_link,
        salary: form.salary
      }])

    if (error) {
      alert(error.message)
      setSaving(false)
      return
    }

    setForm({ title: "", company: "", location: "", description: "", apply_link: "", salary: "" })
    setShowForm(false)
    setSaving(false)
    fetchJobs()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return

    await supabase
      .from("posted_jobs")
      .delete()
      .eq("id", id)

    fetchJobs()
  }

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
          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">Recruiter</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{session?.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/recruiter" })}
            className="text-sm text-gray-500 hover:text-gray-900 uppercase tracking-wide font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto w-full px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Job Postings</h2>
            <p className="text-sm text-gray-400 mt-1">{jobs.length} job{jobs.length !== 1 ? "s" : ""} posted</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition"
          >
            + Post a Job
          </button>
        </div>

        {/* Job Post Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5">New Job Posting</h3>

            <div className="flex flex-col gap-4">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Job Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Company Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={form.company}
                    onChange={e => setForm({ ...form, company: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Location *</label>
                  <input
                    type="text"
                    placeholder="e.g. Pune, Maharashtra"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Salary (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹4-6 LPA"
                    value={form.salary}
                    onChange={e => setForm({ ...form, salary: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Apply Link (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. https://yourcompany.com/apply"
                  value={form.apply_link}
                  onChange={e => setForm({ ...form, apply_link: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Job Description *</label>
                <textarea
                  placeholder="Describe the role, responsibilities, requirements..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setShowForm(false)
                    setForm({ title: "", company: "", location: "", description: "", apply_link: "", salary: "" })
                  }}
                  className="px-5 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Posting..." : "Post Job"}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Job List */}
        {jobs.length === 0 && !showForm ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 text-sm">No jobs posted yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
            >
              Post your first job
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-lg font-bold text-indigo-600 shrink-0">
                      {job.company?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-xs text-indigo-600 mt-0.5">{job.company}</p>
                      <p className="text-xs text-gray-400 mt-0.5">📍 {job.location}</p>
                      {job.salary && (
                        <p className="text-xs text-green-600 mt-0.5">💰 {job.salary}</p>
                      )}
                      <p className="text-xs text-gray-300 mt-1">
                        Posted {new Date(job.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-xs text-red-400 hover:text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition shrink-0"
                  >
                    Delete
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  )
}