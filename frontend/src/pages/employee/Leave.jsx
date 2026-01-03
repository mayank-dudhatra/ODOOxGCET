import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import {
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiPlus,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import api from "../../services/api";

export default function Leave() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leaveBalance, setLeaveBalance] = useState({
    totalLeaves: 18,
    usedLeaves: 0,
    remainingLeaves: 18,
    leaveTypes: [],
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [formData, setFormData] = useState({
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: "",
    document: null,
  });

  // Fetch leave data
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/leave/my");
        console.log("Leave data received:", response.data);
        setLeaveBalance(response.data.leaveBalance);
        setLeaveRequests(response.data.leaveRequests);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load leave data");
        console.error("Leave fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLeaveData();
    }
  }, [user]);

  // Auto-refresh every 30 seconds to stay in sync
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const response = await api.get("/leave/my");
        console.log("Auto-refresh - Leave data:", response.data);
        setLeaveBalance(response.data.leaveBalance);
        setLeaveRequests(response.data.leaveRequests);
      } catch (err) {
        console.error("Auto-refresh error:", err);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

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
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading leave data...</p>
              </div>
            </div>
          ) : (
            <>
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
              {leaveBalance.leaveTypes && leaveBalance.leaveTypes.length > 0 ? (
                leaveBalance.leaveTypes.map((leave, idx) => (
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
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No leave types configured</p>
              )}
            </div>
          </div>

          {/* Leave Requests */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Requests</h2>
            <div className="space-y-3">
              {leaveRequests && leaveRequests.length > 0 ? (
                leaveRequests.map((request) => (
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
              ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No leave requests yet</p>
                  <p className="text-sm text-gray-400 mt-1">Click "Apply Leave" to submit your first request</p>
                </div>
              )}
            </div>
          </div>
            </>
          )}
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Apply for Leave</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  // Map leave type display name to backend value
                  const leaveTypeMap = {
                    "Sick Leave": "sick",
                    "Casual Leave": "casual",
                    "Earned Leave": "earned",
                    "Unpaid Leave": "unpaid",
                  };

                  // For sick leave, document is required
                  if (formData.leaveType === "Sick Leave" && !formData.document) {
                    alert("Document is required for Sick Leave");
                    return;
                  }

                  // Create FormData for file upload
                  const submitData = new FormData();
                  submitData.append("leaveType", leaveTypeMap[formData.leaveType] || formData.leaveType.toLowerCase());
                  submitData.append("startDate", formData.startDate);
                  submitData.append("endDate", formData.endDate);
                  submitData.append("reason", formData.reason);
                  
                  if (formData.document) {
                    submitData.append("document", formData.document);
                  }

                  const response = await api.post("/leave/apply", submitData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  });

                  // Refresh leave data from backend to update balance
                  const updatedLeaveData = await api.get("/leave/my");
                  setLeaveBalance(updatedLeaveData.data.leaveBalance);
                  setLeaveRequests(updatedLeaveData.data.leaveRequests);

                  setShowModal(false);
                  setFormData({ leaveType: "Casual Leave", startDate: "", endDate: "", reason: "", document: null });
                  alert("Leave request submitted successfully!");
                } catch (err) {
                  alert(err.response?.data?.error || "Failed to submit leave request");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type
                </label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
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
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
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
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                ></textarea>
              </div>

              {formData.leaveType === "Sick Leave" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Document <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Upload medical certificate, doctor's note, or prescription (PDF/Image)</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData({ ...formData, document: e.target.files?.[0] || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.document && (
                    <p className="text-xs text-green-600 mt-1">✓ {formData.document.name}</p>
                  )}
                </div>
              )}

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
