import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  getPayrunDetails,
  getPayslips,
  getPayrollSummary,
  getPayrollPeriods,
} from "../../services/dummyData";
import {
  FiSearch,
  FiGrid,
  FiList,
  FiDownload,
  FiCheck,
} from "react-icons/fi";

export default function Payroll() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, payrun
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState("October");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list"); // list, grid

  const payrunDetails = getPayrunDetails(selectedMonth, selectedYear);
  const payslips = getPayslips(selectedMonth, selectedYear);
  const payrollSummary = getPayrollSummary(selectedMonth, selectedYear);

  // Filter payslips
  const filteredPayslips = payslips.filter(
    (slip) =>
      slip.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slip.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const availableYears = [2023, 2024, 2025, 2026];

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
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
            <h1 className="text-3xl font-bold text-gray-900">Payroll</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2">
              <FiCheck className="w-4 h-4" />
              Validate
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-2 font-medium transition border-b-2 ${
                activeTab === "dashboard"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("payrun")}
              className={`py-4 px-2 font-medium transition border-b-2 ${
                activeTab === "payrun"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Payrun
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === "dashboard" ? (
            <>
              {/* Dashboard Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-gray-600 text-sm font-medium">
                    Total Employees
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {payrollSummary.totalPayslips}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-gray-600 text-sm font-medium">
                    Employer Cost
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {formatCurrency(payrollSummary.totalEmployerCost)}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-gray-600 text-sm font-medium">
                    Gross Salary
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {formatCurrency(payrollSummary.totalGrossWage)}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-gray-600 text-sm font-medium">
                    Net Salary
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {formatCurrency(payrollSummary.totalNetWage)}
                  </p>
                </div>
              </div>

              {/* Dashboard Overview */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Payroll Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-700">Total Employees</span>
                    <span className="text-lg font-medium text-gray-900">
                      {payrollSummary.totalPayslips}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-700">Total Employer Cost</span>
                    <span className="text-lg font-medium text-gray-900">
                      {formatCurrency(payrollSummary.totalEmployerCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-700">Total Gross Salary</span>
                    <span className="text-lg font-medium text-gray-900">
                      {formatCurrency(payrollSummary.totalGrossWage)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total Net Salary</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(payrollSummary.totalNetWage)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Payrun Tab Content */}
              {payrunDetails && (
                <>
                  {/* Payrun Header */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Payrun {payrunDetails.month} {payrunDetails.year}
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">
                          Pay Period: {payrunDetails.period} | Pay Date:{" "}
                          {payrunDetails.payDate}
                        </p>
                      </div>
                      <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium text-sm">
                        {payrunDetails.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-6">
                      {payrunDetails.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs font-medium text-gray-600 uppercase mb-2">
                          Employer Cost
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(payrunDetails.employerCost)}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs font-medium text-gray-600 uppercase mb-2">
                          Gross
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(payrunDetails.grossSalary)}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs font-medium text-gray-600 uppercase mb-2">
                          Net
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(payrunDetails.netSalary)}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs font-medium text-gray-600 uppercase mb-2">
                          Status
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {payrunDetails.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payslip List View */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">
                        Payslip List view
                      </h2>
                      <div className="flex items-center gap-2">
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

                    {/* Search */}
                    <div className="flex items-center gap-2 mb-6 px-4 py-3 border border-gray-200 rounded-lg bg-white">
                      <FiSearch className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 outline-none text-sm"
                      />
                    </div>

                    {/* List View */}
                    {viewMode === "list" && (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                                Pay Period
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                                Employee
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                                Employer Cost
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                                Basic Wage
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                                Gross Wage
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                                Net Wage
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredPayslips.map((slip) => (
                              <tr
                                key={slip.id}
                                onClick={() =>
                                  navigate(
                                    `/admin/payroll/${slip.employeeId}/${selectedMonth.toLowerCase()}/${selectedYear}`
                                  )
                                }
                                className="border-b border-gray-200 hover:bg-blue-50 transition cursor-pointer"
                              >
                                <td className="px-6 py-4">
                                  <p className="text-sm text-gray-900">
                                    {slip.period}
                                  </p>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-sm font-medium text-gray-900">
                                    {slip.employeeName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {slip.employeeId}
                                  </p>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-sm font-medium text-gray-900">
                                    {formatCurrency(slip.employerCost)}
                                  </p>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-sm text-gray-900">
                                    {formatCurrency(slip.basicWage)}
                                  </p>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-sm text-gray-900">
                                    {formatCurrency(slip.grossWage)}
                                  </p>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-sm font-medium text-gray-900">
                                    {formatCurrency(slip.netWage)}
                                  </p>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                    {slip.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Grid View */}
                    {viewMode === "grid" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPayslips.map((slip) => (
                          <div
                            key={slip.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {slip.employeeName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {slip.employeeId}
                                </p>
                              </div>
                              <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                                {slip.status}
                              </span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Basic:</span>
                                <span className="font-medium">
                                  {formatCurrency(slip.basicWage)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Gross:</span>
                                <span className="font-medium">
                                  {formatCurrency(slip.grossWage)}
                                </span>
                              </div>
                              <div className="flex justify-between pt-2 border-t">
                                <span className="text-gray-600 font-medium">
                                  Net:
                                </span>
                                <span className="font-bold text-blue-600">
                                  {formatCurrency(slip.netWage)}
                                </span>
                              </div>
                            </div>
                            <button className="w-full mt-4 p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2">
                              <FiDownload className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
