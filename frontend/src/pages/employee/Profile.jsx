import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FiEdit2, FiMail, FiPhone, FiBriefcase, FiMapPin, FiCalendar } from "react-icons/fi";
import { getCurrentEmployeeData } from "../../services/dummyData";

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const employee = getCurrentEmployeeData();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-sm text-gray-500 mt-1">Your personal information</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <FiEdit2 className="w-5 h-5" />
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Profile Header Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mb-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
                <span className="text-4xl font-semibold">
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900">{employee.name}</h2>
                <p className="text-lg text-blue-600 font-medium mt-1">{employee.position}</p>
                <p className="text-gray-600 text-sm mt-2">{employee.department} Department</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

              {!isEditing ? (
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Full Name
                    </label>
                    <p className="text-gray-900 font-medium mt-1">{employee.name}</p>
                  </div>

                  {/* Employee ID */}
                  <div className="pt-3 border-t border-gray-200">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Employee ID
                    </label>
                    <p className="text-gray-900 font-medium mt-1">{employee.id}</p>
                  </div>

                  {/* Join Date */}
                  <div className="pt-3 border-t border-gray-200">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Date of Joining
                    </label>
                    <p className="text-gray-900 font-medium mt-1">{employee.joinDate}</p>
                  </div>

                  {/* Email */}
                  <div className="pt-3 border-t border-gray-200">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <FiMail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900 font-medium">{employee.email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="pt-3 border-t border-gray-200">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900 font-medium">{employee.phone}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={employee.name}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={employee.email}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue={employee.phone}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Professional Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>

              <div className="space-y-4">
                {/* Department */}
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Department
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <FiMapPin className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900 font-medium">{employee.department}</p>
                  </div>
                </div>

                {/* Position */}
                <div className="pt-3 border-t border-gray-200">
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Position
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <FiBriefcase className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900 font-medium">{employee.position}</p>
                  </div>
                </div>

                {/* Reporting Manager */}
                <div className="pt-3 border-t border-gray-200">
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Reporting Manager
                  </label>
                  <p className="text-gray-900 font-medium mt-1">{employee.reportingManager}</p>
                </div>

                {/* Employment Status */}
                <div className="pt-3 border-t border-gray-200">
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Employment Status
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <p className="text-gray-900 font-medium">Active</p>
                  </div>
                </div>

                {/* Join Date */}
                <div className="pt-3 border-t border-gray-200">
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Joined On
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <FiCalendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900 font-medium">{employee.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Years of Service */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Years of Service
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  {new Date().getFullYear() - new Date(employee.joinDate).getFullYear()}
                </p>
              </div>

              {/* Next Review Date */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Next Review Date
                </p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {new Date(new Date().getFullYear() + 1, 0, 15).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>

            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between">
                <span className="font-medium text-gray-900">Change Password</span>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between">
                <span className="font-medium text-gray-900">Two-Factor Authentication</span>
                <span className="text-gray-400">Disabled</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
