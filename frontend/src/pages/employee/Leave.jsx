import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiPlus,
  FiChevronDown,
} from "react-icons/fi";
import { getLeaveBalance, getLeaveRequests } from "../../services/dummyData";

export default function Leave() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const leaveBalance = getLeaveBalance();
  const leaveRequests = getLeaveRequests();

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <FiCheckCircle className="w-5 h-5" />;
      case "Pending":
        return <FiClock className="w-5 h-5" />;
      case "Rejected":
        return <FiAlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Time Off Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your leaves and time off</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <FiPlus className="w-5 h-5" />
              Apply Leave
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Leave Balance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Leaves Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leaves</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {leaveBalance.totalLeaves}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Days per year</p>
                </div>
                <FiCalendar className="w-8 h-8 text-blue-500 opacity-20" />
              </div>
            </div>

            {/* Used Leaves Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Used Leaves</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {leaveBalance.usedLeaves}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-orange-600 h-2 rounded-full"
                      style={{
                        width: `${(leaveBalance.usedLeaves / leaveBalance.totalLeaves) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <FiCheckCircle className="w-8 h-8 text-orange-500 opacity-20" />
              </div>
            </div>

            {/* Remaining Leaves Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Remaining Leaves</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {leaveBalance.remainingLeaves}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Available to use</p>
                </div>
                <FiCalendar className="w-8 h-8 text-green-500 opacity-20" />
              </div>
            </div>
          </div>

          {/* Leave Types Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Types Breakdown</h2>
            <div className="space-y-3">
              {leaveBalance.leaveTypes.map((leave, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{leave.type}</p>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span className="text-gray-600">
                        Total: <span className="font-semibold text-gray-900">{leave.total}</span>
                      </span>
                      <span className="text-gray-600">
                        Used: <span className="font-semibold text-orange-600">{leave.used}</span>
                      </span>
                      <span className="text-gray-600">
                        Remaining:{" "}
                        <span className="font-semibold text-green-600">{leave.remaining}</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${(leave.used / leave.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leave Requests */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Requests</h2>
            <div className="space-y-3">
              {leaveRequests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  {/* Summary Row */}
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === request.id ? null : request.id)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-gray-900">{request.type}</p>
                          <span
                            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getStatusBadgeColor(
                              request.status
                            )}`}
                          >
                            {getStatusIcon(request.status)}
                            {request.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {request.fromDate === request.toDate
                            ? request.fromDate
                            : `${request.fromDate} to ${request.toDate}`}{" "}
                          • {request.days} day{request.days > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <FiChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedId === request.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Expanded Details */}
                  {expandedId === request.id && (
                    <div className="px-6 py-4 bg-white border-t border-gray-200 space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 text-xs font-medium">Reason</p>
                          <p className="text-gray-900 font-medium mt-1">{request.reason}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs font-medium">Applied On</p>
                          <p className="text-gray-900 font-medium mt-1">{request.appliedOn}</p>
                        </div>
                        {request.status !== "Pending" && (
                          <>
                            <div>
                              <p className="text-gray-600 text-xs font-medium">Approved By</p>
                              <p className="text-gray-900 font-medium mt-1">
                                {request.approvedBy || "—"}
                              </p>
                            </div>
                            {request.status === "Rejected" && (
                              <div>
                                <p className="text-gray-600 text-xs font-medium">
                                  Rejection Reason
                                </p>
                                <p className="text-red-600 font-medium mt-1">
                                  {request.rejectionReason}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {request.status === "Pending" && (
                        <div className="flex gap-3 pt-3 border-t border-gray-200">
                          <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 rounded-lg transition">
                            Cancel Request
                          </button>
                          <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-lg transition">
                            Edit Request
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply for Leave</h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select leave type</option>
                  {leaveBalance.leaveTypes.map((leave, idx) => (
                    <option key={idx}>{leave.type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <textarea
                  placeholder="Reason for leave"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
