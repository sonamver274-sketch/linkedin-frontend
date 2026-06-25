"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import api from "@/lib/axios";
import { Pencil, Users, Briefcase, X, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", headline: "", profilePicture: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    try { await api.delete("/auth/logout") } catch {}
    logout()
    router.push("/login")
  };

  useEffect(() => {
    if (!user?._id) return;
    const fetchProfile = async () => {
      const res = await api.get("/user/profile/" + user._id);
      const p = res.data.data.profile;
      setProfile(p);
      setForm({ name: p.name || "", headline: p.headline || "", profilePicture: p.profilePicture || "" });
    };
    fetchProfile();
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("image", file)
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setForm((prev) => ({ ...prev, profilePicture: res.data.data.url }))
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.post("/user/profile/update", form);
      setUser(res.data.data.updateProfile);
      setProfile((prev) => ({ ...prev, ...form }));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef] pt-16">
      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-3">

        {/* ── MAIN CARD ── */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Cover */}
          <div className="h-40 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 relative" />

          {/* Avatar + actions */}
          <div className="px-6 pb-5">
            <div className="flex items-end justify-between -mt-14 mb-2">
              <div className="relative">
                <img
                  src={profile.profilePicture || "/avatar.svg"}
                  alt={profile.name}
                  className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-md"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="mb-1 flex items-center gap-2 border border-blue-600 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-blue-50 transition"
                >
                  <Pencil size={14} />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="mb-1 flex items-center gap-2 border border-red-400 text-red-400 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-red-50 transition"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{profile.name}</h1>
            <p className="text-gray-500 mt-1 text-sm leading-snug">
              {profile.headline || <span className="italic text-gray-400">Add a headline</span>}
            </p>
            <p className="text-gray-400 text-xs mt-1">{profile.email}</p>

            <div className="flex items-center gap-4 mt-3">
              <button className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:underline">
                <Users size={15} />
                {profile.connection?.length || 0} connections
              </button>
            </div>
          </div>
        </div>

        {/* ── ABOUT ── */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-2">About</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {profile.headline || "Add a headline or bio to tell people about yourself."}
          </p>
        </div>

        {/* ── STATS ── */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">Analytics</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-100 rounded-xl p-4 hover:shadow transition cursor-default">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Users size={16} />
                Connections
              </div>
              <p className="text-2xl font-bold text-gray-900">{profile.connection?.length || 0}</p>
            </div>
            <div className="border border-gray-100 rounded-xl p-4 hover:shadow transition cursor-default">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Briefcase size={16} />
                Profile Status
              </div>
              <p className="text-sm font-semibold text-green-600 mt-1">Active</p>
            </div>
          </div>
        </div>

        {/* ── SKILLS ── */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {["React", "Next.js", "Node.js", "MongoDB", "Tailwind CSS", "JavaScript"].map((skill) => (
              <span key={skill} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100">
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* ── EDIT MODAL ── */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-xl">Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
              <img
                src={form.profilePicture || "/avatar.svg"}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                onError={(e) => (e.target.src = "/avatar.svg")}
              />
              <div>
                <p className="font-semibold text-gray-900">{form.name || "Your Name"}</p>
                <p className="text-sm text-gray-500">{form.headline || "Your headline"}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Headline</label>
              <input
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="e.g. Full Stack Developer | React | Node.js"
                className="border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Profile Picture</label>
              <div className="flex items-center gap-3">
                <img
                  src={form.profilePicture || "/avatar.svg"}
                  className="w-12 h-12 rounded-full object-cover border"
                  onError={(e) => (e.target.src = "/avatar.svg")}
                />
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition">
                  {uploading ? "Uploading..." : "Choose Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-1">
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-full text-sm font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
