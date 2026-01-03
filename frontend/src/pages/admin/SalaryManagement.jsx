import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getAllEmployeeSalaries } from "../../services/dummyData";
import { FiSearch, FiEye, FiEdit2, FiGrid, FiList } from "react-icons/fi";

export default function SalaryManagement() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [viewMode, setViewMode] = useState("list");

  const salaries = getAllEmployeeSalaries();

  // Get unique departments
  const departments = [
    "All Departments",
    ...new Set(salaries.map((s) => s.department)),
  ];

  // Filter salaries
  const filteredSalaries = salaries.filter((salary) => {
    const matchesSearch =
      salary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salary.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salary.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      salary.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} h-screen overflow-auto`}>
        {/* Header */}
        <div className="bg-white shadow-sm p-6 sticky top-0 z-30">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Salary Management
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              View and manage employee salary details
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Employee Salaries Section */}
          <div className="bg-white rounded-lg shadow-sm">
            {/* Section Header */}
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Employee Salaries
              </h2>
              <p className="text-sm text-gray-600">
                Click on an employee to view and update their salary information
              </p>
            </div>

            {/* Search and Filters */}
            <div className="p-6 space-y-4 border-b border-gray-200">
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white">
                <FiSearch className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 outline-none text-sm"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <FiGrid className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* List View */}
            {viewMode === "list" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                        Employee ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                        Department
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                        Position
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                        Current Salary
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSalaries.map((salary) => (
                      <tr
                        key={salary.employeeId}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {salary.employeeId}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {salary.name}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">
                            {salary.email}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {salary.department}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {salary.position}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(salary.monthWage)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/salary-management/${salary.employeeId}`
                              )
                            }
                            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium text-sm"
                          >
                            <FiEye className="w-4 h-4" />
                            View/Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {filteredSalaries.map((salary) => (
                  <div
                    key={salary.employeeId}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 font-medium">ID</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {salary.employeeId}
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-600 font-medium">Name</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {salary.name}
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-600 font-medium">
                        Position
                      </p>
                      <p className="text-sm text-gray-900">{salary.position}</p>
                      <p className="text-xs text-gray-600">
                        {salary.department}
                      </p>
                    </div>

                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-600 font-medium">
                        Monthly Salary
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(salary.monthWage)}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/admin/salary-management/${salary.employeeId}`)
                      }
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      View/Edit
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredSalaries.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-600">No employees found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
