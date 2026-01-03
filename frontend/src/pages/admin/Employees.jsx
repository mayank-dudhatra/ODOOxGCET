import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import EmployeeDetailsModal from "../../components/EmployeeDetailsModal";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronDown } from "react-icons/fi";

export default function Employees() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Dummy employees data
  const [employees, setEmployees] = useState([
    {
      id: "EMP001",
      name: "Arjun Sharma",
      email: "arjun.sharma@company.com",
      phone: "+91 98765 43210",
      department: "Engineering",
      position: "Senior Developer",
      joinDate: "2022-01-15",
      status: "Active",
      salary: 85000,
    },
    {
      id: "EMP002",
      name: "Priya Verma",
      email: "priya.verma@company.com",
      phone: "+91 98765 43211",
      department: "HR",
      position: "HR Manager",
      joinDate: "2021-06-10",
      status: "Active",
      salary: 65000,
    },
    {
      id: "EMP003",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@company.com",
      phone: "+91 98765 43212",
      department: "Engineering",
      position: "Lead Developer",
      joinDate: "2020-03-20",
      status: "Active",
      salary: 95000,
    },
    {
      id: "EMP004",
      name: "Anjali Singh",
      email: "anjali.singh@company.com",
      phone: "+91 98765 43213",
      department: "Marketing",
      position: "Marketing Executive",
      joinDate: "2022-09-05",
      status: "Active",
      salary: 50000,
    },
    {
      id: "EMP005",
      name: "Vikram Patel",
      email: "vikram.patel@company.com",
      phone: "+91 98765 43214",
      department: "Finance",
      position: "Finance Analyst",
      joinDate: "2021-11-12",
      status: "Inactive",
      salary: 55000,
    },
  ]);

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole === "all" || emp.department === filterRole;
    return matchesSearch && matchesRole;
  });

  const departments = ["all", ...new Set(employees.map((e) => e.department))];

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
              <h1 className="text-2xl font-bold text-gray-900">Employees Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage all employees in the system</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <FiPlus className="w-5 h-5" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 font-medium">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{employees.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 font-medium">Active</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {employees.filter((e) => e.status === "Active").length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 font-medium">Inactive</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {employees.filter((e) => e.status === "Inactive").length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 font-medium">Departments</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {new Set(employees.map((e) => e.department)).size}
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Department Filter */}
              <div className="relative">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results */}
              <div className="flex items-center justify-end">
                <p className="text-sm text-gray-600">
                  Found <span className="font-semibold">{filteredEmployees.length}</span> employee
                  {filteredEmployees.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Employees Table */}
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
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Salary
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedEmployeeId(emp.id)}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-500">{emp.email}</p>
                          <p className="text-xs text-gray-400">{emp.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{emp.department}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{emp.position}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{emp.joinDate}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(emp.status)}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">₹{emp.salary.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredEmployees.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-500">No employees found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Employee</h2>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select department</option>
                    <option>Engineering</option>
                    <option>HR</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Details Modal */}
      {selectedEmployeeId && (
        <EmployeeDetailsModal
          employeeId={selectedEmployeeId}
          onClose={() => setSelectedEmployeeId(null)}
        />
      )}
    </div>
  );
}
