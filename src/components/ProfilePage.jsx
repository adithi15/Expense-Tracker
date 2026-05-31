import React, { useState, useEffect, useRef } from "react";
import { Mail, Briefcase, Building2, ShieldCheck, User, CheckCircle, XCircle, Camera } from "lucide-react";

export default function ProfilePage({ currentUser }) {
  const isAdmin = currentUser.role === "Admin";
  const [profilePic, setProfilePic] = useState(null);
  const fileInputRef = useRef(null);

  // Load saved profile picture for this user from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`profile_pic_${currentUser.email}`);
    if (saved) setProfilePic(saved);
  }, [currentUser.email]);

  // When user picks a file, convert to base64 and save
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setProfilePic(base64);
      localStorage.setItem(`profile_pic_${currentUser.email}`, base64);
    };
    reader.readAsDataURL(file);
  };

  const permissions = [
    { label: "View own expenses",          allowed: true },
    { label: "Submit new claims",          allowed: true },
    { label: "Export CSV reports",         allowed: true },
    { label: "View all employee expenses", allowed: isAdmin },
    { label: "Approve / Reject claims",    allowed: isAdmin },
    { label: "Reimburse claims",           allowed: isAdmin },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

        {/* Banner */}
        <div className={`h-28 w-full ${isAdmin ? "bg-indigo-600" : "bg-emerald-600"}`} />

        {/* Avatar + Name row */}
        <div className="px-6 pt-0 pb-6">
          <div className="-mt-12 mb-5 flex items-end gap-4">

            {/* Avatar with camera overlay */}
            <div className="relative flex-shrink-0">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="size-28 rounded-2xl border-4 border-white shadow-sm object-cover"
                />
              ) : (
                <div className={`size-28 rounded-2xl border-4 border-white shadow-sm flex items-center justify-center text-3xl font-bold ${isAdmin ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"}`}>
                  {currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
              )}

              {/* Camera button */}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                title="Change profile picture"
                className="absolute -bottom-1.5 -right-1.5 size-7 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition"
              >
                <Camera className="size-3.5" />
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Name + role */}
            <div className="pb-2">
              <h2 className="text-xl font-bold text-slate-900 leading-tight">{currentUser.name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{currentUser.department || "No department"}</p>
              <span className={`mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${isAdmin ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>
                {isAdmin ? <ShieldCheck className="size-3.5" /> : <User className="size-3.5" />}
                {currentUser.role}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 mb-5" />

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
              <Mail className="size-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm font-medium text-slate-800 break-all">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
              <Briefcase className="size-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role</p>
                <p className="text-sm font-medium text-slate-800">{currentUser.role}</p>
              </div>
            </div>

            {currentUser.department && (
              <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
                <Building2 className="size-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</p>
                  <p className="text-sm font-medium text-slate-800">{currentUser.department}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Permissions Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="size-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-700">Account Permissions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {permissions.map((item) => (
            <div
              key={item.label}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border ${item.allowed ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-100"}`}
            >
              <span className={`text-xs font-medium ${item.allowed ? "text-slate-700" : "text-slate-400"}`}>
                {item.label}
              </span>
              {item.allowed
                ? <CheckCircle className="size-4 text-emerald-500 flex-shrink-0" />
                : <XCircle className="size-4 text-slate-300 flex-shrink-0" />
              }
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}