"use client"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import useAuthStore from "@/store/authStore"

const typeColors = {
  "Full-time": "bg-blue-100 text-blue-700",
  "Part-time": "bg-yellow-100 text-yellow-700",
  "Internship": "bg-green-100 text-green-700",
  "Remote": "bg-purple-100 text-purple-700"
}

const filters = ["All", "Full-time", "Part-time", "Internship", "Remote"]

export default function JobsPage() {
  const user = useAuthStore((state) => state.user)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("All")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", company: "", location: "", description: "", type: "Full-time" })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await api.get("/job/all")
      setJobs(res.data.data.jobs)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePostJob = async () => {
    if (!form.title || !form.company || !form.location || !form.description) return
    try {
      const res = await api.post("/job/create", form)
      setJobs((prev) => [res.data.data.job, ...prev])
      setForm({ title: "", company: "", location: "", description: "", type: "Full-time" })
      setShowForm(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleApply = async (jobId) => {
    try {
      await api.put(`/job/apply/${jobId}`)
      setJobs((prev) =>
        prev.map((j) => {
          if (j._id !== jobId) return j
          const alreadyApplied = j.applicants.includes(user?._id)
          return {
            ...j,
            applicants: alreadyApplied
              ? j.applicants.filter((id) => id !== user?._id)
              : [...j.applicants, user?._id]
          }
        })
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (jobId) => {
    try {
      await api.delete(`/job/delete/${jobId}`)
      setJobs((prev) => prev.filter((j) => j._id !== jobId))
    } catch (err) {
      console.error(err)
    }
  }

  const filteredJobs = activeFilter === "All" ? jobs : jobs.filter((j) => j.type === activeFilter)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 md:pt-16 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 md:pt-16">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">Jobs</h1>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "+ Post a Job"}
          </button>
        </div>

        {/* Post Job Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-5 mb-5 flex flex-col gap-3">
            <h2 className="font-semibold text-gray-800">Post a New Job</h2>
            <input
              placeholder="Job Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm outline-none"
            />
            <input
              placeholder="Company Name *"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm outline-none"
            />
            <input
              placeholder="Location *"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm outline-none"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm outline-none"
            >
              {filters.slice(1).map((t) => <option key={t}>{t}</option>)}
            </select>
            <textarea
              placeholder="Job Description *"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="border rounded-lg px-3 py-2 text-sm outline-none resize-none"
            />
            <button
              onClick={handlePostJob}
              className="self-end bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700"
            >
              Post Job
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-4">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${activeFilter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
            Is category mein koi job nahi hai abhi
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredJobs.map((job) => {
              const isApplied = job.applicants.some(
                (id) => id === user?._id || id?.toString() === user?._id?.toString()
              )
              const isOwner = job.postedBy?._id === user?._id || job.postedBy?._id?.toString() === user?._id?.toString()

              return (
                <div key={job._id} className="bg-white rounded-xl shadow p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-bold text-gray-900 text-base">{job.title}</h2>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[job.type]}`}>
                          {job.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{job.company}</p>
                      <p className="text-xs text-gray-400 mt-0.5">📍 {job.location}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <img
                        src={job.postedBy?.profilePicture || "/avatar.svg"}
                        className="w-8 h-8 rounded-full object-cover"
                        title={job.postedBy?.name}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mt-3 line-clamp-2">{job.description}</p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-400">
                      {job.applicants.length} applicant{job.applicants.length !== 1 ? "s" : ""}
                    </span>
                    <div className="flex gap-2">
                      {isOwner ? (
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="text-sm text-red-400 hover:text-red-600 px-3 py-1.5"
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApply(job._id)}
                          className={`px-5 py-1.5 rounded-full text-sm font-medium transition ${isApplied ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                        >
                          {isApplied ? "Applied ✓" : "Apply"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
