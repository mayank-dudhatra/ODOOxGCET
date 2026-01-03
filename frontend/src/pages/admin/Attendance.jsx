import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import {
  FiSearch,
  FiCalendar,
  FiFilter,
  FiDownload,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiXCircle,
  FiEdit2,
} from "react-icons/fi";
import api from "../../services/api";

export default function AdminAttendance() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [allAttendance, setAllAttendance] = useState([]);
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
  });
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState(["all"]);

  // Fetch attendance data
  useEffect(() => {
    fetchAttendanceData();
  }, [filterDate]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/attendance/all?date=${filterDate}`);
      const { attendance, summary: summaryData } = response.data;

      setAllAttendance(attendance);
      setSummary(summaryData);

      // Extract unique departments
      const uniqueDepts = ["all", ...new Set(attendance.map((r) => r.department))];
      setDepartments(uniqueDepts);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter attendance records
  const filteredAttendance = allAttendance.filter((record) => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      filterDepartment === "all" || record.department === filterDepartment;
    const matchesStatus =
      filterStatus === "all" || 
      record.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesDept && matchesStatus;
  });

  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "present":
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case "absent":
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      case "late":
        return <FiClock className="w-5 h-5 text-orange-500" />;
      case "half-day":
        return <FiAlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "late":
        return "bg-orange-100 text-orange-800";
      case "half-day":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const capitalizeStatus = (status) => {
    if (status === "half-day") return "Half Day";
    return status.charAt(0).toUpperCase() + status.slice(1);
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
              <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
              <p className="text-sm text-gray-500 mt-1">
                {user?.role === "admin" ? "Track and manage all employees' attendance" : "View all employees' attendance"}
              </p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
              <FiDownload className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Today's Summary */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <p className="text-sm text-gray-600 font-medium">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summary.totalEmployees}</p>
            </div>
            <div className="bg-green-50 rounded-lg border border-green-200 p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-600 font-medium">Present</p>
              </div>
              <p className="text-3xl font-bold text-green-600 mt-2">{summary.present}</p>
            </div>
            <div className="bg-red-50 rounded-lg border border-red-200 p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <FiXCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-600 font-medium">Absent</p>
              </div>
              <p className="text-3xl font-bold text-red-600 mt-2">{summary.absent}</p>
            </div>
            <div className="bg-orange-50 rounded-lg border border-orange-200 p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <FiClock className="w-5 h-5 text-orange-600" />
                <p className="text-sm text-orange-600 font-medium">Late</p>
              </div>
              <p className="text-3xl font-bold text-orange-600 mt-2">{summary.late}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-600 font-medium">Half Day</p>
              </div>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{summary.halfDay}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline mr-2 w-4 h-4" />
                  Date
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiSearch className="inline mr-2 w-4 h-4" />
                  Search Employee
                </label>
                <input
                  type="text"
                  placeholder="Name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiFilter className="inline mr-2 w-4 h-4" />
                  Department
                </label>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiFilter className="inline mr-2 w-4 h-4" />
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="half-day">Half Day</option>
                </select>
              </div>

              {/* Results */}
              <div className="flex items-end">
                <p className="text-sm text-gray-600 font-medium">
                  Found: <span className="text-lg font-bold text-blue-600">{filteredAttendance.length}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Check-In
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Check-Out
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Working Hours
                    </th>
                    {(user?.role === "admin" || user?.role === "hr") && (
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.length > 0 ? (
                    filteredAttendance.map((record, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {record.employeeName}
                            </p>
                            <p className="text-xs text-gray-500">{record.employeeId}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{record.department}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{record.position}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(record.status)}
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                record.status
                              )}`}
                            >
                              {capitalizeStatus(record.status)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {record.checkInTime || "—"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {record.checkOutTime || "—"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {record.workingHours || "—"}
                          </p>
                        </td>
                        {(user?.role === "admin" || user?.role === "hr") && (
                          <td className="px-6 py-4">
                            <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition">
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={user?.role === "admin" || user?.role === "hr" ? "8" : "7"} className="px-6 py-8 text-center">
                        <p className="text-gray-500">No attendance records found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Present</span>
              </div>
              <div className="flex items-center gap-3">
                <FiXCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-700">Absent</span>
              </div>
              <div className="flex items-center gap-3">
                <FiClock className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-gray-700">Late</span>
              </div>
              <div className="flex items-center gap-3">
                <FiAlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-gray-700">Half Day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
