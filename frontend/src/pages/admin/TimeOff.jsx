import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import { FiSearch, FiCheck, FiX, FiFilter } from "react-icons/fi";
import api from "../../services/api";

export default function TimeOff() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLeaveType, setFilterLeaveType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);

  // Fetch leave requests
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        setLoading(true);
        const response = await api.get("/leave/all");
        setLeaveRequests(response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load leave requests");
        console.error("Leave fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLeaveRequests();
    }
  }, [user]);

  // Calculate summary
  const summary = {
    total: leaveRequests.length,
    pending: leaveRequests.filter((r) => r.status === "Pending").length,
    approved: leaveRequests.filter((r) => r.status === "Approved").length,
    rejected: leaveRequests.filter((r) => r.status === "Rejected").length,
  };

  // Filter leave requests
  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.department && request.department.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;

    const matchesLeaveType =
      filterLeaveType === "all" || request.leaveType === filterLeaveType;

    return matchesSearch && matchesStatus && matchesLeaveType;
  });

  const getStatusColor = (status) => {
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

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case "Paid Leave":
        return "bg-blue-100 text-blue-800";
      case "Sick Leave":
        return "bg-orange-100 text-orange-800";
      case "Casual Leave":
        return "bg-purple-100 text-purple-800";
      case "Earned Leave":
        return "bg-indigo-100 text-indigo-800";
      case "Unpaid Leave":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await api.put(`/leave/${requestId}/approve`);
      // Refresh the list
      const response = await api.get("/leave/all");
      setLeaveRequests(response.data);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to approve leave");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await api.put(`/leave/${requestId}/reject`);
      // Refresh the list
      const response = await api.get("/leave/all");
      setLeaveRequests(response.data);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to reject leave");
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} h-screen overflow-auto`}>
        {/* Header */}
        <div className="bg-white shadow-sm p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Time Off</h1>
            <p className="text-gray-600 text-sm mt-1">
              {user?.role === "admin"
                ? "Manage all employee leave requests and approvals"
                : "Review and manage leave requests"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading leave requests...</p>
              </div>
            </div>
          ) : (
            <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Requests
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {summary.total}
                  </p>
                </div>
                <div className="p-4 bg-blue-100 rounded-full">
                  <FiFilter className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {summary.pending}
                  </p>
                </div>
                <div className="p-4 bg-yellow-100 rounded-full">
                  <FiFilter className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Approved</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {summary.approved}
                  </p>
                </div>
                <div className="p-4 bg-green-100 rounded-full">
                  <FiCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Rejected</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {summary.rejected}
                  </p>
                </div>
                <div className="p-4 bg-red-100 rounded-full">
                  <FiX className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FiSearch className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by employee name, ID or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Leave Type
                </label>
                <select
                  value={filterLeaveType}
                  onChange={(e) => setFilterLeaveType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="Paid Leave">Paid Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Results
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700">
                  {filteredRequests.length} record{filteredRequests.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>

          {/* Leave Requests Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                    Leave Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                    Days
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                    Applied On
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {request.employeeName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {request.department} • {request.employeeId}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(request.leaveType)}`}
                        >
                          {request.leaveType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {request.startDate} to {request.endDate}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {request.days}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{request.reason}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {request.appliedOn}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {request.status === "Pending" ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition"
                              title="Approve"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition"
                              title="Reject"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            {request.approvedBy && (
                              <p className="text-xs text-gray-600">
                                by {request.approvedBy}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center">
                      <p className="text-gray-600">No leave requests found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
